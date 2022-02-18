# catapult-client
Catapult battle game written by [Phaser 3](https://phaser.io/phaser3).

To create docker image run:
```shell
docker build -t catapult-client
```
To run catapult client docker image run:
```shell
docker run --name catapult-client --network network-name --restart always -v /path-to-nginx-log:/var/log/nginx -d catapult-client
```
