from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import defaultdict, deque
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from the React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

def is_directed_acyclic_graph(nodes, edges):
    """Check if a graph is a Directed Acyclic Graph (DAG) using topological sort."""
    # Create an adjacency list representation of the graph
    graph = defaultdict(list)
    in_degree = {node['id']: 0 for node in nodes}
    
    # Build the graph
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source and target:
            # Handle edge formats with strings or objects
            source_id = source if isinstance(source, str) else source.get('id')
            target_id = target if isinstance(target, str) else target.get('id')
            
            # Handle edges with formatted IDs (like "node-1-output")
            if "-" in source_id:
                source_id = source_id.split("-")[0]
            if "-" in target_id:
                target_id = target_id.split("-")[0]
                
            graph[source_id].append(target_id)
            in_degree[target_id] = in_degree.get(target_id, 0) + 1
    
    # Perform topological sort
    queue = deque([node_id for node_id, degree in in_degree.items() if degree == 0])
    visited_count = 0
    
    while queue:
        current = queue.popleft()
        visited_count += 1
        
        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If all nodes are visited, there's no cycle
    return visited_count == len(nodes)

@app.post('/pipelines/parse')
def parse_pipeline(pipeline_data: PipelineData = Body(...)):
    nodes = pipeline_data.nodes
    edges = pipeline_data.edges
    
    # Count nodes and edges
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Check if the graph is a DAG
    is_dag = is_directed_acyclic_graph(nodes, edges)
    
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag
    }
