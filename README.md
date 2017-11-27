# neo4j
## 一、安装
### 1.安装JAVA8
	sudo add-apt-repository ppa:webupd8team/java
	sudo apt-get update
	sudo apt-get install oracle-java8-installer

### 2.添加neo4j源
	wget -O - https://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add -
	echo 'deb http://debian.neo4j.org/repo stable/' | sudo tee -a /etc/apt/sources.list.d/neo4j.list
	sudo apt-get update


	社区办:
	sudo apt-get install neo4j=3.1.4
	企业版(付费):
	sudo apt-get install neo4j-enterprise=3.1.4


### 3.neo4j配置里表示对外开放http
	dbms.connectors.default_listen_address=0.0.0.0
#### HTTP Connector. There must be exactly one HTTP connector.
	dbms.connector.http.enabled=true
	dbms.connector.http.listen_address=0.0.0.0:7474



## 二、批量导入数据

### 1.获取用户
	mongo -u name -p password ip:port/db --shell ./getNode.js > node.csv

getNode.js：

	var c = db.user.find();
	var tmp = {};
	print("userId:ID,:LABEL")
	while(c.hasNext()) {
	  tmp = c.next()
	  tmp = tmp.userId + ",user";
	  print(tmp);
	}
	exit


### 2.获取用户关系
	mongo -u name -p password ip:port/db --shell ./getAllUserFri.js > relationship.csv

getRelationship.js：

	var c = db.relationship.aggregate([{$match : {}},{$unwind: "$friends"}]);
	var tmp = {};
	print(":START_ID,:END_ID,:type")
	while(c.hasNext()) {
	  tmp = c.next()
	  if (tmp.userId && tmp.friends.id){
	      tmp = tmp.userId + ',' + tmp.friends.id + ",F";
	      print(tmp);
	  }
	}
	exit

 打开文件修改格式  shift + g 到文件底部

### 3.导入信息
	sudo neo4j-admin import --mode=csv --database=graph.db --nodes=./node.csv --relationships=./relationship.csv
graph.db为数据库存储位置必须为空，将路径删除即可，详细可到配置文件中查看 /etc/neo4j/neo4j.conf

