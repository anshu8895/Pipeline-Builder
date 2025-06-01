// submit.js

import { useState, useEffect } from 'react';
import { useStore } from './store';
import { AlertMessage } from './AlertMessage';

export const SubmitButton = () => {
    const nodes = useStore(state => state.nodes);
    const edges = useStore(state => state.edges);
    const [isLoading, setIsLoading] = useState(false);
    const [alertInfo, setAlertInfo] = useState(null);

    // Automatically clear alert after it's been displayed for a while
    useEffect(() => {
        if (alertInfo) {
            const clearTimer = setTimeout(() => {
                setAlertInfo(null);
            }, 8000); // Clear after 8 seconds (slightly longer than alert duration)

            return () => clearTimeout(clearTimer);
        }
    }, [alertInfo]);

    const handleSubmit = async () => {
        try {
            // Reset alert state at the beginning of each submission
            setAlertInfo(null);
            setIsLoading(true);

            // Log the data being sent
            console.log('Submitting pipeline with:', { nodes, edges });

            // Send data to the backend
            // Use environment-appropriate API URL
            const apiUrl = process.env.NODE_ENV === 'production' 
                ? '/api/pipelines/parse' 
                : 'http://localhost:8000/pipelines/parse';
                
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Format the response message
            const dagStatus = data.is_dag ? 'Yes ✅' : 'No ❌';
            const message = `Pipeline has ${data.num_nodes} nodes, ${data.num_edges} edges. DAG: ${dagStatus}`;

            // Show success alert
            setAlertInfo({
                message,
                type: 'success'
            });
        } catch (error) {
            console.error('Error submitting pipeline:', error);

            // Show error alert with environment-appropriate message
            const errorMessage = process.env.NODE_ENV === 'production' 
                ? `Error: ${error.message}. Please try again or contact support if the issue persists.`
                : `Error: ${error.message}. Make sure the FastAPI backend is running at http://localhost:8000.`;
                
            setAlertInfo({
                message: errorMessage,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="floating-submit-container">
                <button
                    className={`submit-button floating-submit ${isLoading ? 'loading' : ''}`}
                    onClick={handleSubmit}
                    disabled={isLoading}
                    type="button"
                >
                    {isLoading ? 'Submitting...' : 'Submit Pipeline'}
                </button>
            </div>

            {/* Show alert if we have a message to display */}
            {alertInfo && (
                <AlertMessage
                    message={alertInfo.message}
                    type={alertInfo.type}
                    autoClose={true}
                    duration={6000}
                />
            )}
        </>
    );
};
