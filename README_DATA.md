## Backups

for mongosh initialization command

```bash

# create dump
mongodump --db test --gzip --archive="C:\Users\Edouard\_codebase\mongo\data\test.archive.gz"

# restore dump
mongorestore --archive=/docker-entrypoint-initdb.d/archive.gz --gzip --username "root" --password "edouard" --authenticationDatabase admin --archive="C:\Users\Edouard\_codebase\mongo\data\test.archive.gz"

```
