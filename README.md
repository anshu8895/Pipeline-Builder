# Pipeline Builder

A visual node-based pipeline editor built with React Flow and FastAPI.

## Features

- Interactive drag-and-drop node-based editor
- Multiple node types (Input, Output, LLM, Text, Math, API, Filter, Transform, Delay)
- Text nodes with dynamic variable detection
- Auto-resizing nodes
- Node deletion with hover UI
- Dark/light theme support
- Pipeline validation with DAG detection
- Real-time feedback on pipeline structure

## Tech Stack

### Frontend
- React
- React Flow for node-based UI
- Zustand for state management
- Modern CSS with variables for theming

### Backend
- FastAPI (Python)
- Topological sort algorithm for DAG validation

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- npm or yarn

### Backend Setup
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## How to Use

1. Drag nodes from the toolbar onto the canvas
2. Connect nodes by dragging from one handle to another
3. Edit node properties through their respective interfaces
4. Click "Submit Pipeline" to validate the pipeline structure
5. Delete nodes by hovering over them and clicking the X button


