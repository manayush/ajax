document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const countryList = document.getElementById('country-list');

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            let countries = data;

            // Sort countries alphabetically by name
            countries.sort((a, b) => {
                if (a.name.common < b.name.common) return -1;
                if (a.name.common > b.name.common) return 1;
                return 0;
            });

            function displayCountries(countries) {
                countryList.innerHTML = '';
                countries.forEach(country => {
                    const countryItem = document.createElement('li');
                    countryItem.classList.add('country-item');

                    const flagImg = document.createElement('img');
                    flagImg.classList.add('flag-img');
                    const flagUrl = `https://flagcdn.com/w80/${country.cca2.toLowerCase()}.png`;
                    flagImg.src = flagUrl;
                    flagImg.alt = `${country.name.common} Flag`;

                    // Handle image load errors
                    flagImg.onerror = () => {
                        console.error(`Failed to load image from ${flagUrl}`);
                        flagImg.src = 'path/to/default/flag.png'; // Fallback image
                    };

                    const countryContent = document.createElement('div');
                    countryContent.classList.add('country-content');

                    const countryLink = document.createElement('a');
                    countryLink.classList.add('country-link');
                    countryLink.href = `detail.html?country=${country.cca3}`;
                    countryLink.textContent = country.name.common;

                    // Get currency information
                    const currency = Object.values(country.currencies || {}).map(cur => cur.name).join(', ');
                    const currencyElement = document.createElement('p');
                    currencyElement.classList.add('currency-info');
                    currencyElement.textContent = `Currency: ${currency}`;

                    // Create container for date and time
                    const dateTimeElement = document.createElement('p');
                    dateTimeElement.classList.add('date-time-info');
                    dateTimeElement.textContent = 'Date and Time: Loading...';

                    // Fetch current date and time for the country
                    const timezone = (country.timezones && country.timezones.length > 0) ? country.timezones[0] : 'Etc/UTC';
                    fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
                        .then(response => response.json())
                        .then(timeData => {
                            if (timeData && timeData.datetime) {
                                const dateTime = new Date(timeData.datetime);
                                dateTimeElement.textContent = `Date: ${dateTime.toLocaleDateString()} | Time: ${dateTime.toLocaleTimeString()}`;
                            } else {
                                dateTimeElement.textContent = 'Date and Time: Invalid or not available';
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching time:', error);
                            dateTimeElement.textContent = 'Date and Time: Invalid or not available';
                        });

                    // Create button container
                    const buttonContainer = document.createElement('div');
                    buttonContainer.classList.add('button-container');

                   

                    const showMapBtn = document.createElement('a');
                    showMapBtn.classList.add('show-map-btn');
                    showMapBtn.href = country.maps.googleMaps || '#';
                    showMapBtn.target = "_blank";
                    showMapBtn.textContent = "Show Map";

                    const detailBtn = document.createElement('a');
                    detailBtn.classList.add('detail-btn');
                    detailBtn.href = `detail.html?country=${country.cca3}`;
                    detailBtn.textContent = "Detail";
                    buttonContainer.appendChild(showMapBtn);
                    buttonContainer.appendChild(detailBtn);
                   

                    countryContent.appendChild(countryLink);
                    countryContent.appendChild(currencyElement);
                    countryContent.appendChild(dateTimeElement);
                    countryContent.appendChild(buttonContainer);

                    countryItem.appendChild(flagImg);
                    countryItem.appendChild(countryContent);

                    countryList.appendChild(countryItem);
                });
            }

            displayCountries(countries);

            searchBar.addEventListener('input', function() {
                const searchText = searchBar.value.toLowerCase();
                const filteredCountries = countries.filter(country =>
                    country.name.common.toLowerCase().includes(searchText)
                );
                displayCountries(filteredCountries);
            });
        })
        .catch(error => {
            console.error('Error fetching country data:', error);
        });
});
