# EduPath Unified API

A comprehensive API that aggregates upcoming government exams, admission schedules, scholarships, and other important education-related deadlines across India.

## 🚀 Features

- **Multi-source Data Aggregation**: Fetches from NTA, UPSC, SSC, NSP, CBSE, UGC, and more
- **Intelligent Normalization**: Converts diverse data formats into a unified schema
- **Real-time Updates**: Automatic data refresh with configurable intervals
- **Advanced Filtering**: Filter by category, status, priority, geography, dates, and more
- **Data Quality Monitoring**: Automatic validation and improvement of data quality
- **Source Health Monitoring**: Detects format changes and source failures
- **REST API**: Comprehensive RESTful endpoints with pagination and search
- **Client Integration**: Ready-to-use JavaScript client for frontend integration

## 📊 Data Sources

### Government Exam Sources
- **National Testing Agency (NTA)** - JEE, NEET, UGC NET, etc.
- **UPSC** - Civil Services, CDS, CAPF, etc.
- **Staff Selection Commission (SSC)** - CGL, CHSL, MTS, etc.

### Scholarship Sources
- **National Scholarship Portal** - Central & State scholarships
- **AICTE** - Technical education scholarships

### Admission Sources
- **CBSE** - Board exam and admission notifications
- **UGC** - University-level admissions and announcements

## 🛠️ Installation

### Prerequisites
- Node.js 16.0.0 or higher
- SQLite3
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/edupath-api.git
cd edupath-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize database**
```bash
npm run migrate
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
For administrative endpoints, include the API key in headers:
```
X-API-Key: your-admin-api-key
```

### Core Endpoints

#### Get Announcements
```http
GET /api/announcements
```

**Query Parameters:**
- `category` - Filter by category (exam, admission, scholarship, notification, result)
- `status` - Filter by status (upcoming, active, closed, completed, cancelled)
- `priority` - Filter by priority (low, medium, high, urgent)
- `scope` - Filter by geographic scope (national, state, regional, institutional)
- `state` - Filter by state name
- `source` - Filter by data source
- `search` - Text search in title and description
- `tags` - Filter by tags (comma-separated)
- `date_from` - Filter announcements from date (YYYY-MM-DD)
- `date_to` - Filter announcements to date (YYYY-MM-DD)
- `application_deadline_from` - Filter by application deadline from date
- `application_deadline_to` - Filter by application deadline to date
- `limit` - Number of results (default: 20, max: 100)
- `offset` - Pagination offset
- `page` - Page number (alternative to offset)
- `sort_by` - Sort field (date_published, date_application_end, priority)
- `sort_order` - Sort direction (ASC, DESC)

**Example:**
```http
GET /api/announcements?category=exam&status=active&state=Delhi&limit=10
```

#### Search Announcements
```http
GET /api/search?q=NEET&category=exam&limit=5
```

#### Get Specific Announcement
```http
GET /api/announcements/{id}
```

#### Get Categories
```http
GET /api/categories
```

#### Get Trending Announcements
```http
GET /api/trending
```

#### Track User Interaction
```http
POST /api/track
Content-Type: application/json

{
  "announcement_id": "abc123",
  "action": "view",
  "user_id": "user123"
}
```

**Valid Actions:** view, bookmark, share, click, apply

#### Trigger Data Refresh (Admin)
```http
POST /api/refresh
X-API-Key: your-admin-key
```

#### Get Statistics
```http
GET /api/statistics
```

#### Get Source Status
```http
GET /api/sources
```

### Response Format

All responses follow this structure:
```json
{
  "success": true,
  "data": [...],
  "count": 10,
  "timestamp": "2024-01-21T10:30:00.000Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `ADMIN_API_KEY` | Admin API key for protected endpoints | - |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | * |
| `DB_PATH` | SQLite database path | ./edupath_announcements.db |
| `ENABLE_AUTO_REFRESH` | Enable automatic data refresh | true |
| `REFRESH_INTERVAL_HOURS` | Auto-refresh interval | 6 |
| `MAX_RETRIES` | Max retries for failed requests | 3 |
| `REQUEST_TIMEOUT` | Request timeout in milliseconds | 30000 |
| `RATE_LIMIT_WINDOW` | Rate limit window in minutes | 15 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🎯 Frontend Integration

### Using the JavaScript Client

```javascript
// Initialize the API client
const apiClient = new EduPathAPIClient('http://localhost:3000/api');

// Get active exams
const activeExams = await apiClient.getActiveExams({
  state: 'Delhi',
  limit: 10
});

// Search for specific announcements
const searchResults = await apiClient.searchAnnouncements('NEET', {
  category: 'exam'
});

// Track user interaction
await apiClient.trackInteraction('announcement_id', 'view');
```

### Integration with Existing Timeline

To integrate with your existing timeline page, include the client script:

```html
<script src="api/client-integration.js"></script>
<script>
  // The timeline will automatically load API data
  // Your existing timeline functions will work alongside API data
</script>
```

## 📱 Sample API Responses

### Announcement Object
```json
{
  "id": "nta_jee_main_2024",
  "title": "JEE Main 2024 - Session 1",
  "description": "Joint Entrance Examination for admission to NITs, IIITs, and CFTIs",
  "category": "exam",
  "subcategory": "engineering",
  "source_name": "National Testing Agency",
  "source_url": "https://nta.ac.in",
  "source_type": "government",
  "credibility_score": 10,
  "date_published": "2024-01-15T09:00:00.000Z",
  "date_application_start": "2024-02-01T00:00:00.000Z",
  "date_application_end": "2024-02-29T23:59:59.000Z",
  "date_exam": "2024-04-15T09:30:00.000Z",
  "country": "India",
  "states": [],
  "scope": "national",
  "eligibility": {
    "education_level": "12th",
    "subjects": ["Physics", "Chemistry", "Mathematics"],
    "age_max": 25
  },
  "links": {
    "official_url": "https://jeemain.nta.nic.in",
    "application_url": "https://jeemain.nta.nic.in/apply",
    "notification_pdf": "https://jeemain.nta.nic.in/notification.pdf"
  },
  "status": "active",
  "priority": "high",
  "tags": ["engineering", "entrance", "national"],
  "metadata": {
    "data_quality_score": 9.5,
    "automated": true,
    "last_scraped": "2024-01-21T08:30:00.000Z"
  }
}
```

## 🔍 Monitoring and Maintenance

### Health Dashboard
Access the API health status:
```http
GET /api/health
```

### Data Quality Monitoring
The system automatically:
- Validates data completeness and accuracy
- Detects format changes in source feeds
- Provides data quality scores
- Suggests improvements for low-quality data

### Source Monitoring
- Tracks source availability and response times
- Detects format changes
- Provides fallback mechanisms
- Sends alerts for critical issues

### Automated Updates
- Scheduled data refresh every 6 hours (configurable)
- Intelligent retry mechanisms for failed requests
- Exponential backoff for rate-limited sources
- Graceful degradation when sources are unavailable

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
```bash
export NODE_ENV=production
export PORT=3000
export ADMIN_API_KEY=your-secure-key
```

2. **Database Optimization**
```bash
# Enable WAL mode for better performance
sqlite3 edupath_announcements.db "PRAGMA journal_mode=WAL;"
```

3. **Process Management (PM2)**
```bash
npm install -g pm2
pm2 start server.js --name edupath-api
pm2 startup
pm2 save
```

4. **Reverse Proxy (Nginx)**
```nginx
server {
    listen 80;
    server_name api.edupath.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t edupath-api .
docker run -d -p 3000:3000 --name edupath-api edupath-api
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing
```bash
# Test data aggregation
curl http://localhost:3000/api/announcements?limit=5

# Test search
curl "http://localhost:3000/api/search?q=NEET&category=exam"

# Test health
curl http://localhost:3000/health
```

## 🔧 Maintenance Scripts

### Manual Data Refresh
```bash
npm run refresh
```

### Database Cleanup
```bash
npm run cleanup
```

### Data Migration
```bash
npm run migrate
```

## 📈 Performance Optimization

### Database Indexing
The system automatically creates indexes on:
- category, status, priority
- date fields
- source information
- geographic scope

### Caching Strategy
- In-memory caching for frequently accessed data
- Client-side caching with configurable TTL
- Database query optimization
- Response compression

### Rate Limiting
- 100 requests per 15-minute window per IP
- Configurable limits for different endpoints
- Graceful degradation under high load

## 🛡️ Security

### API Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

### Admin Endpoints
- API key authentication required
- Restricted access to data refresh and management functions

## 🐛 Troubleshooting

### Common Issues

1. **Source Connection Failures**
   - Check internet connectivity
   - Verify source URLs are accessible
   - Review error logs for specific failures

2. **Database Errors**
   - Ensure SQLite database file permissions
   - Check disk space
   - Verify database schema is up to date

3. **Memory Issues**
   - Monitor Node.js memory usage
   - Adjust cache settings
   - Consider increasing server resources

### Debug Mode
```bash
DEBUG=* npm run dev
```

## 📞 Support

For issues, feature requests, or contributions:

- **GitHub Issues**: https://github.com/your-username/edupath-api/issues
- **Documentation**: https://github.com/your-username/edupath-api/wiki
- **Email**: api-support@edupath.com

## 📄 License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Government portals for providing public data feeds
- Open source community for excellent libraries
- Educational institutions for feedback and requirements

---

**EduPath Unified API** - Empowering students with timely and accurate education information.