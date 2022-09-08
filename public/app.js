if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
        let lat, lon, weather, air;
        lat = position.coords.latitude.toFixed(2);
        lon = position.coords.longitude.toFixed(2);
        document.getElementById('lat').textContent = lat;
        document.getElementById('lon').textContent = lon;
        try {
            const api_url = `/weather/${lat},${lon}`;
            const response = await fetch(api_url);
            const json = await response.json();
            weather = {
                summary: json.weather.weather[0].main,
                temperature: json.weather.main.temp,
            };
            air = json.air_quality.results[0].measurements[0];
            document.getElementById('summary').textContent = weather.summary;
            document.getElementById('temperature').textContent = weather.temperature;
            document.getElementById('aq_parameter').textContent = air.parameter;
            document.getElementById('aq_value').textContent = air.value;
            document.getElementById('aq_units').textContent = air.unit;
            document.getElementById('aq_date').textContent = air.lastUpdated;
        } catch (error) {
            document.getElementById('aq_parameter').textContent = 'No air quality reading.';
            air = { value: -1 };
            weather = {
                summary: 'No weather reading.',
                temperature: 404
            };
            console.log(error);
        }

        const data = { lat, lon, weather, air };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const db_response = await fetch('/api', options);
        const db_json = await db_response.json();
        console.log(db_json);
    });
} else {
    console.log('geolocation not available');
}

