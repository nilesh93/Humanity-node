# Humanity-node
Humanity backend with node.js

# Shortest way. Tested on MacOS, but may work similarly on other OS.

Generate pem

openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365 openssl rsa -in keytmp.pem -out key.pem


ApplicationRef.tick() - similar to Angular 1's $rootScope.$digest() -- i.e., check the full component tree
NgZone.run(callback) - similar to $rootScope.$apply(callback) -- i.e., evaluate the callback function inside the Angular 2 zone. I think, but I'm not sure, that this ends up checking the full component tree after executing the callback function.
ChangeDetectorRef.detectChanges() - similar to $scope.$digest() -- i.e., check only this component and its children
You can inject ApplicationRef, NgZone, or ChangeDetectorRef into your component.