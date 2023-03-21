# Dependency Graph Viewer


Minimal web to view a graphs

# Use Cases

- graph of our IT dependencies
- graph of our software libraries
- graph of our network

# Data

Just add relationships in **./src/main/node/server/cmdb.yaml**

```
acme-api:
  - acme-db
  - acme-security
acme-web:
  - acme-api
acme-db:

acme-security:
```

# Steps

- npm install
- export these values

```
export ENABLE_SECURITY=true
export AUTH_USER=jane
export AUTH_PASSWORD=doe
export PORT=8080
```
- Launch the app

```
npm run start
```

You could see something like this:

![image](https://i.ibb.co/rm87f9h/dependencies-sample.png)

# Custom data

If you don't want to have your data in the git repository, add this variable and restart the app

```
export CMDB_YAML_FILE_LOCATION=/foo/bar/data.yaml
```

# Made with

- https://d3js.org/
- Nodejs & Express

# License

MIT
