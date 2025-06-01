from http.server import BaseHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs
from typing import List, Dict, Any
from collections import defaultdict, deque
import sys
import os

class PipelineData:
    def __init__(self, nodes, edges):
        self.nodes = nodes
        self.edges = edges

def is_directed_acyclic_graph(nodes, edges):
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses topological sorting algorithm.
    """
    if not nodes:
        return True
    
    # Create adjacency list and in-degree count
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    
    # Initialize all nodes with in-degree 0
    for node in nodes:
        node_id = node.get('id')
        if node_id:
            in_degree[node_id] = 0
    
    # Build the graph and calculate in-degrees
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source and target:
            graph[source].append(target)
            in_degree[target] += 1
    
    # Topological sort using Kahn's algorithm
    queue = deque()
    
    # Find all nodes with in-degree 0
    for node_id in in_degree:
        if in_degree[node_id] == 0:
            queue.append(node_id)
    
    processed_count = 0
    
    while queue:
        current = queue.popleft()
        processed_count += 1
        
        # Reduce in-degree for all neighbors
        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we processed all nodes, it's a DAG
    return processed_count == len(nodes)

def parse_pipeline(pipeline_data):
    """
    Parse the pipeline data and return analysis results.
    """
    try:
        nodes = pipeline_data.nodes
        edges = pipeline_data.edges
        
        num_nodes = len(nodes)
        num_edges = len(edges)
        is_dag = is_directed_acyclic_graph(nodes, edges)
        
        return {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": is_dag,
            "status": "success"
        }
    except Exception as e:
        return {
            "error": f"Failed to parse pipeline: {str(e)}",
            "status": "error"
        }

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Set CORS headers
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        try:
            # Read the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON data
            data = json.loads(post_data.decode('utf-8'))
            
            # Create pipeline data object
            pipeline_data = PipelineData(data.get('nodes', []), data.get('edges', []))
            
            # Process the pipeline
            result = parse_pipeline(pipeline_data)
            
            # Return the result
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            error_response = {
                "error": f"Failed to process request: {str(e)}",
                "status": "error"
            }
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
