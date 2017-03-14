![ga](https://cloud.githubusercontent.com/assets/20629455/23824362/2c9817c2-066d-11e7-8988-7b1eefc6d628.jpg)
![wdi](https://cloud.githubusercontent.com/assets/20629455/23824363/2ddeaa7e-066d-11e7-8630-f7c890c9f1c1.png)

___
## Snow Globe

#### Overview
The aim of this project was to use external APIs for the first time and it revolved around the Google Maps API. The map marks Ski Slopes globally and when the marker is clicked you see the current weather, or a three day weather forecast. You can also search for flights and get flight information for the specified day.

![image](https://cloud.githubusercontent.com/assets/23199168/23897920/e4e3ceb2-08a6-11e7-8053-f02c93cf9283.png)

#### How it works

An authenticated app built using jQuery, Mongoose, Express, CSS, Bootstrap and Gulp. Making AJAX requsets to a combination of the Google Maps and OpenSkiMaps APIs to plot global ski resort locations on a map, users are able to click on each marker to see the current weather, or click through to the 3 day weather forecast, using the OpenWeatherMap API. Users are also able to search for flights to and from any destination on any date, and receive details of three seperate flights using the Google QPX API. Users can filter to see plots only in a certain country, which works by sending a new request to the OpenWeatherMap API, and storing only those resorts which match the country selected in the dropdown as a new variable, and running the function to plot the markers on the map again, but using the new, filtered countries.

![image](https://cloud.githubusercontent.com/assets/23199168/23898246/465bd0c6-08a8-11e7-8693-2c3f6721d928.png)



##### Challenges

My access to OpenWeatherMap was blocked as I was making too many requests to the API, as a result of the function to get the weather and forecast for all plotted points as soon as the map loaded. To overcome this I made a seperate API call only when the marker was clicked on, and again a separate call for the forecast only when the user requests it. 
<br>
The OpenSkiMaps API gives all of the resorts a country id rather than calling the country by name, so I had to store the countries as an object of key, value pairs to fetch the correct country name for the dropdown list.

##### Future Steps

The OpenSkiMaps API brings back alot of results, every ski slope rather than resort. I filtered out some of the non-relevant locations like indoor ski centres and dry ski slopes, but I would want to show points based on resort, so that there are less resutlts that are more clear. 
<br>
Currently to search for flights you must know the airport code of where you are flying from and where you are flying to, so LHR for London Heathrow. I would prefer a dropdown menu and/or autofill and ideally would be able to 'find flights' through the marker so that the closest airport is filled in.