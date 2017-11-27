"use strict"
const lib = require('./lib');

/**
 * 创建节点关系
 * @param {节点a} aId 
 */
async function createNode(aId) {
  let cql = 'MERGE (a:user{userId:{aId}}) RETURN a;'
  await lib.dealOneNode(aId, cql);
}

/**
 * 删除节点关系
 * @param {节点a} aId 
 */
async function delNode(aId) {
  let cql = 'Match (a:user{userId:{aId}}) delete a;'
  await lib.dealOneNode(aId, cql);
}

/**
 * 查找一个节点节点关系
 * @param {节点a} aId 
 */
async function findOneNode(aId) {
  let cql = 'Match (a:user{userId:{aId}}) RETURN a;'
  await lib.dealOneNode(aId, cql);
}

module.exports = {
  createNode: createNode,
  delNode: delNode
}