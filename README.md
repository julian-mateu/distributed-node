# Distributed Systems with Node.js

Code and resources from the [Distributed Systems with Node.js](https://thomashunter.name/distributed-systems-with-nodejs) book.

NOTE: when running the node examples in a dev container, all the docker containers won't be reachable unless they are in the same network, so that would have to be manually added. For example, if running ELK from the [`docker-compose.yaml` file](./misc/elk/docker-compose.yaml), the network `elk_default` will be created, and the vscode devcontainer can be added to it with the following command:

```bash
docker network connect elk_default <devcontainer-id>
```