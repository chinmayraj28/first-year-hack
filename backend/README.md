# Backend Server

This folder contains the backend server code for the SproutSense AI Analysis API.

## Server Information

- **Base URL**: `https://7fg18gc3-8000.uks1.devtunnels.ms/api/v1`
- **Hosting**: External server hosted on a different laptop
- **Status**: Currently running and accessible via dev tunnels

## API Endpoints

### Health Check
- `GET /api/v1/health` - Server health status

### Analysis Endpoints
- `POST /api/v1/analysis/advanced` - Advanced analysis for Grade 6+ students
  - Accepts marks and assessment parameters
  - Returns detailed performance analysis, career guidance, and study recommendations

- `POST /api/v1/analysis/game-based` - Game-based analysis for LKG-Grade 2 students
  - Accepts questionnaire responses
  - Returns skillset analysis, learning profile, and development plan

### Student Management
- `GET /api/v1/students` - Student data endpoints

## Authentication

The API uses API key authentication via the `X-API-Key` header.

## Integration

The frontend application integrates with this backend through Next.js API proxy routes:
- `/api/analyze` - Proxies to `/api/v1/analysis/advanced`
- `/api/analyze/questionnaire` - Proxies to `/api/v1/analysis/game-based`

See [API_DOCS.md](../API_DOCS.md) and [API_DOCS 2.md](../API_DOCS%202.md) for detailed API documentation.

## Note

This backend server code was originally hosted on an external laptop. The server implementation details and source code should be added to this folder when available.

