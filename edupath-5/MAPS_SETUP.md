# Google Maps Setup Instructions

## Getting Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for enhanced features)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

## Setup Steps

1. Replace `YOUR_API_KEY` in `colleges.html` with your actual API key:
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap&libraries=places"></script>
   ```

2. For development, you can use the API key without domain restrictions
3. For production, add domain restrictions in Google Cloud Console

## Features Implemented

- Interactive map showing college locations
- Different colored markers for different college types:
  - Red: IIT
  - Orange: NIT  
  - Yellow: IIIT
  - Blue: Central University
  - Green: State University
  - Pink: Medical College
  - Purple: Government College

- Click markers to view college details
- Map automatically adjusts to show all filtered colleges
- Individual college location viewing from college cards

## College Database

The system now includes 30+ government colleges across:
- Jammu & Kashmir (6 colleges)
- Punjab (3 colleges) 
- Himachal Pradesh (3 colleges)
- Haryana (3 colleges)
- Rajasthan (3 colleges)
- Delhi (3 colleges)
- Uttar Pradesh (3 colleges)

Each college includes:
- Exact coordinates for map plotting
- Career relevance mapping for integration
- Detailed facilities and course information
- College type classification