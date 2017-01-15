# Indoor positioning for Exactum

## Short description
The goal of this project is to provide a proof-of-concept software showing how indoor positioning can be implemented by relying on Wi-Fi information from the surrounding access points.

## Positioning system
The project contains the `reader` module which was used to save Wi-Fi readings in different parts of the first and second floors of the Exactum building. From each area 10 measurements were taken between 5 second intervals and the area was labeled (e.g. D2 is the D-wings second floor). These sets were stored into a MongoDB instance.

A Node.js server is running on AWS EC2 listening for HTTP calls from clients. The client sends its current Wi-Fi readings to the server, and a simple k-nearest neighbors algorithms classifies the set of readings into some area of the building. Satisfying results were achieved with `k = 5`. The distance calculation between two sets of observations was done by comparing RSSI values between common MAC-addresses and if there was an access point in the client's data that was not found from the server, a penalty was given, and also vice versa.

The server then broadcasts the user's location via WebSocket to all the clients connected to the server.

## Improvements to consider
Euclidean distance is fine but our we concluded that even better results can be achieved. For example the hyperbolic fingerprinting method where differences between access point RSSI values of one Wi-Fi scan are used, might be more accurate.