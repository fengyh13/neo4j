"use strict"
const lib = require('./lib');
const nodeLib = require('./node')

/**
 * 创建节点关系
 * @param {节点a} aId 
 * @param {节点b} bId 
 */
async function createRelationship(aId, bId) {
  //merge节点
  await nodeLib.createNode(aId);
  await nodeLib.createNode(bId);

  //建立双向关系
  let cql1 = 'Match (a:user{userId:{aId}}), (b:user{userId:{bId}}) with a,b MERGE (b)-[:F]->(a)'
  let cql2 = 'Match (a:user{userId:{aId}}), (b:user{userId:{bId}}) with a,b MERGE (b)<-[:F]-(a)'
  await lib.dealTwoNode(aId, bId, cql1);
  await lib.dealTwoNode(aId, bId, cql2);
}

/**
 * 删除节点关系
 * @param {节点a} aId 
 * @param {节点b} bId 
 */
async function delRelationship(aId, bId) {
  let cql = 'Match (a:user{userId:{aId}})-[r:F]-(b:user{userId:{bId}}) delete r;'
  await lib.dealTwoNode(aId, bId, cql);
}

/**
 * 随机查找一个二度人脉
 * @param {节点a} aId 
 */
async function findOneSecondContact(aId) {
  let cql = "Match (a:user{userId:{aId}}) match (a)-[:F]->(fri)-[:F]->(fof) with a,fof OPTIONAL Match (a)-[r]-(fof) with fof,r where r is null and fof <> a RETURN fof.userId as userId ORDER BY rand() limit 1";
  return await lib.dealOneNode(aId, cql);
}

/**
 * 随机查找二度人脉
 * @param {节点a} aId 
 * @param {数量} count 
 */
async function findSecondContact(aId, count) {
  let cql = "Match (a:user{userId:{aId}}) match (a)-[:F]->(fri)-[:F]->(fof) with a,fof OPTIONAL Match (a)-[r]-(fof) with fof,r where r is null and fof <> a RETURN fof.userId as userId ORDER BY rand()";
  if (count > 0){
    cql = cql + " limit" + count;
  }

  return await lib.dealOneNode(aId, cql);
}

/**
 * 查找一个二度人脉共同好友
 * @param {节点a} aId 
 * @param {节点b} bId 
 */
async function findCommonFri(aId, bId) {
  let cql = "match (a:user{userId:{aId}})-[:F]->(fri)<-[:F]-(b:user{userId:{bId}}) return fri";
  return await lib.dealTwoNode(aId, bId, cql);
}

/**
 * 查找两个人的非共同好友
 * @param {节点a} aId 
 * @param {节点b} bId 
 */
async function findNotCommonFri(aId, bId) {
  let cql = "match (a:user{userId:{aId}})-[:F]->(fri) with fri OPTIONAL Match (fri)-[r]-(b:user{userId:{bId}}) with fri, r where r is null return fri";
  return await lib.dealTwoNode(aId, bId, cql);
}

module.exports = {
  createRelationship: createRelationship,
  delRelationship: delRelationship,
  findOneSecondContact: findOneSecondContact,
  findSecondContact: findSecondContact,
  findCommonFri : findCommonFri,
  findNotCommonFri: findNotCommonFri
}