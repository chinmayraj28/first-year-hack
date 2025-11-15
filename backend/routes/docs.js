const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

/**
 * @route GET /api/v1/docs
 * @desc Serve API documentation as HTML
 * @access Public
 */
router.get('/', (req, res) => {
  try {
    const docsPath = path.join(__dirname, '../API_DOCS.md');
    const markdown = fs.readFileSync(docsPath, 'utf8');
    
    // Convert markdown to simple HTML
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SproutSense API Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1, h2, h3 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        h1 {
            text-align: center;
            color: #3498db;
            font-size: 2.5em;
        }
        code {
            background-color: #f1f2f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
        }
        pre {
            background-color: #2f3640;
            color: #f1f2f6;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            border-left: 4px solid #3498db;
        }
        pre code {
            background: none;
            color: inherit;
            padding: 0;
        }
        .endpoint {
            background-color: #e8f5e8;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
            border-left: 4px solid #27ae60;
        }
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            margin-right: 10px;
        }
        .get { background-color: #27ae60; }
        .post { background-color: #3498db; }
        .put { background-color: #f39c12; }
        .delete { background-color: #e74c3c; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #3498db;
            color: white;
        }
        .toc {
            background-color: #ecf0f1;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
        }
        .auth-required {
            color: #e74c3c;
            font-weight: bold;
        }
        .auth-not-required {
            color: #27ae60;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌱 SproutSense API Documentation</h1>
        
        <div class="toc">
            <h3>📋 Table of Contents</h3>
            <ul>
                <li><a href="#authentication">🔐 Authentication</a></li>
                <li><a href="#health-endpoints">💚 Health Endpoints</a></li>
                <li><a href="#analysis-endpoints">🧠 Analysis Endpoints</a></li>
                <li><a href="#student-endpoints">👨‍🎓 Student Management</a></li>
                <li><a href="#error-codes">❌ Error Codes</a></li>
                <li><a href="#examples">💡 Examples</a></li>
            </ul>
        </div>

        <div id="authentication" class="endpoint">
            <h2>🔐 Authentication</h2>
            <p>All endpoints (except health checks) require an API key:</p>
            <pre><code>X-API-Key: 123</code></pre>
            <p>Or as query parameter: <code>?apiKey=123</code></p>
        </div>

        <div id="health-endpoints">
            <h2>💚 Health Endpoints</h2>
            
            <div class="endpoint">
                <h3><span class="method get">GET</span>/api/v1/health</h3>
                <p><span class="auth-not-required">No Authentication Required</span></p>
                <p>Basic health check to verify server is running.</p>
            </div>

            <div class="endpoint">
                <h3><span class="method get">GET</span>/api/v1/health/detailed</h3>
                <p><span class="auth-not-required">No Authentication Required</span></p>
                <p>Detailed health information with system metrics.</p>
            </div>
        </div>

        <div id="analysis-endpoints">
            <h2>🧠 Analysis Endpoints</h2>
            
            <div class="endpoint">
                <h3><span class="method post">POST</span>/api/v1/analysis/game-based</h3>
                <p><span class="auth-required">Authentication Required</span></p>
                <p>Analyze student performance based on game results (all grades).</p>
                <h4>Request Body Example:</h4>
                <pre><code>{
  "studentName": "John Doe",
  "age": 8,
  "grade": "3",
  "gameResults": [{
    "game": "Memory Match",
    "score": 85,
    "accuracy": 90,
    "reactionTime": 1200,
    "attempts": 5,
    "timeSpent": 300,
    "mistakes": [{"type": "attention", "description": "Lost focus"}]
  }]
}</code></pre>
            </div>

            <div class="endpoint">
                <h3><span class="method post">POST</span>/api/v1/analysis/advanced</h3>
                <p><span class="auth-required">Authentication Required</span></p>
                <p>Analyze student performance based on subject marks (grades 6-12).</p>
                <h4>Request Body Example:</h4>
                <pre><code>{
  "studentId": "student-123",
  "studentName": "Jane Smith",
  "grade": "10",
  "academicYear": "2024-25",
  "subjectAssessments": [{
    "subjectName": "Mathematics",
    "obtainedMarks": 85,
    "assessmentParameters": {
      "applicationBasedQuestions": 4,
      "theoryQuestions": 5,
      "effortPutIn": 5,
      "problemSolvingCaseStudy": 4,
      "recallQuestions": 3
    }
  }]
}</code></pre>
            </div>

            <div class="endpoint">
                <h3><span class="method get">GET</span>/api/v1/analysis/test-ollama</h3>
                <p><span class="auth-required">Authentication Required</span></p>
                <p>Test Ollama connection and available models.</p>
            </div>
        </div>

        <div id="student-endpoints">
            <h2>👨‍🎓 Student Management</h2>
            
            <div class="endpoint">
                <h3><span class="method get">GET</span>/api/v1/students</h3>
                <p><span class="auth-required">Authentication Required</span></p>
                <p>Get all students with pagination and filtering.</p>
                <p><strong>Query Parameters:</strong> page, limit, grade, search</p>
            </div>

            <div class="endpoint">
                <h3><span class="method get">GET</span>/api/v1/students/:id</h3>
                <p><span class="auth-required">Authentication Required</span></p>
                <p>Get specific student by ID with assessments.</p>
            </div>

            <div class="endpoint">
                <h3><span class="method post">POST</span>/api/v1/students</h3>
                <p><span class="auth-required">Authentication Required</span></p>
                <p>Create new student.</p>
            </div>

            <div class="endpoint">
                <h3><span class="method put">PUT</span>/api/v1/students/:id</h3>
                <p><span class="auth-required">Authentication Required</span></p>
                <p>Update existing student.</p>
            </div>

            <div class="endpoint">
                <h3><span class="method delete">DELETE</span>/api/v1/students/:id</h3>
                <p><span class="auth-required">Authentication Required</span></p>
                <p>Delete student and all assessments.</p>
            </div>
        </div>

        <div id="error-codes">
            <h2>❌ Error Codes</h2>
            <table>
                <thead>
                    <tr><th>Status Code</th><th>Description</th></tr>
                </thead>
                <tbody>
                    <tr><td>200</td><td>Success</td></tr>
                    <tr><td>201</td><td>Created</td></tr>
                    <tr><td>400</td><td>Bad Request / Validation Error</td></tr>
                    <tr><td>401</td><td>Unauthorized / Invalid API Key</td></tr>
                    <tr><td>404</td><td>Not Found</td></tr>
                    <tr><td>429</td><td>Too Many Requests (Rate Limited)</td></tr>
                    <tr><td>500</td><td>Internal Server Error</td></tr>
                </tbody>
            </table>
        </div>

        <div id="examples">
            <h2>💡 Frontend Integration Examples</h2>
            
            <h3>JavaScript Fetch</h3>
            <pre><code>const analyzeStudent = async (data) => {
  const response = await fetch('http://localhost:5000/api/v1/analysis/game-based', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': '123'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};</code></pre>

            <h3>React Hook</h3>
            <pre><code>const useAnalysis = () => {
  const [loading, setLoading] = useState(false);
  
  const analyze = async (data, type = 'game-based') => {
    setLoading(true);
    try {
      const response = await fetch(\`http://localhost:5000/api/v1/analysis/\${type}\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': '123'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } finally {
      setLoading(false);
    }
  };
  
  return { analyze, loading };
};</code></pre>

            <h3>Test with cURL</h3>
            <pre><code># Health check
curl -H "X-API-Key: 123" http://localhost:5000/api/v1/health

# Game-based analysis
curl -X POST http://localhost:5000/api/v1/analysis/game-based \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: 123" \\
  -d '{"studentName":"John","age":8,"grade":"3","gameResults":[...]}'</code></pre>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ecf0f1; text-align: center; color: #7f8c8d;">
            <p>🌱 <strong>SproutSense AI Analysis Backend</strong> | Version 1.0.0</p>
            <p>For support, please refer to the complete documentation or contact the development team.</p>
        </div>
    </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error loading documentation',
      details: error.message
    });
  }
});

/**
 * @route GET /api/v1/docs/markdown
 * @desc Serve raw markdown documentation
 * @access Public
 */
router.get('/markdown', (req, res) => {
  try {
    const docsPath = path.join(__dirname, '../API_DOCS.md');
    const markdown = fs.readFileSync(docsPath, 'utf8');
    
    res.setHeader('Content-Type', 'text/markdown');
    res.send(markdown);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error loading documentation',
      details: error.message
    });
  }
});

module.exports = router;
