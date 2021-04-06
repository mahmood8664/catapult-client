# catapult-client
Catapult battle game written by Phaser 3.

To play this game go to: [http://mamiri.me/catapult](http://mamiri.me/catapult)

To create docker image run:
```shell
docker build -t catapult-client
```
To run catapult client docker image run:
```shell
docker run --name catapult-client --network network-name --restart always -v /path-to-nginx-log:/var/log/nginx -d catapult-client
```
