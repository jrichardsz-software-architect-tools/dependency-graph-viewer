# Dependencies Graph Viewer

A simple web to view your dependencies as graphs

## Use Cases

- graph of our IT dependencies
- graph of our software libraries
- graph of our network

## Data

Just add relationships in **./src/main/node/server/cmdb-v1.yaml**

```
acme-api:
  - acme-db
  - acme-security
acme-web:
  - acme-api
acme-db:

acme-security:
```

## Start

```
npm install
npm run start
```

If the yaml in resources folder is **./src/main/node/server/cmdb-v1.yaml**, enter to this url `http://localhost:2708?id=cmdb-v1` and you should see something like this:

![image](https://user-images.githubusercontent.com/3322836/233228165-76d9d7a7-4da4-484a-b28a-f4254bf7a20b.png)

There is an ecommerce sample http://localhost:2708/?id=ecommerce

<img src="https://github.com/jrichardsz-software-architect-tools/dependency-graph-viewer/assets/3322836/2eb58c7f-beab-479b-9589-390c0cc7b21b"  width=600>

## Start with docker

Build

```
docker build -t $(basename "$PWD") .
```

run:


```
docker run -d --name $(basename "$PWD") -p 2708:2708 $(basename "$PWD")
```

## Custom data location

If you don't want to have your data in the git repository, add this variable and restart the app

```
export CMDB_YAML_FILE_LOCATION=/foo/bar/data.yaml
```

## Custom title

```
export WEB_TITLE="My Awesome Graph"
```

## Custom Security

**Basic Auth**

```
export SECURITY_TYPE=basic
export AUTH_USER=jane
export AUTH_PASSWORD=doe
```

**Microsoft Authorization Code Grant**

```
export SECURITY_TYPE=microsoft
export BASE_URL=http://localhost:2708
export LOGIN_OAUTH2_CLIENT_ID=ce239943-6ce5-changeme-bd10-a3bbe7296d95
export LOGIN_OAUTH2_CLIENT_SECRET=9886ad74-8f49-changeme-921a-1a4aa5778ec0
export ALLOWED_USERS="jane@microsoft.com"
```

## Update dependencies

**From Excel**

|app|dependencies|
|:--|:--|
|web|api1, api2, api3|

- Download the excel
- export this variable

```
export excel_absolute_file_location="/tmp/workspace/foo.xlsx"
export sheet_index=0
export export_name=foo
```

- execute

```
npm run update:dependencies
```

This will create a yaml located in src/main/resources/foo.yaml and to view it go to  `http://localhost:2708?id=foo`

# Made with

- https://d3js.org/
- Nodejs & Express

# License

MIT

# Contributor

- JRichardsz