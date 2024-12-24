---
title: "Expression Tree"
date: 2024-12-15
last_modified_at: 2024-12-15
categories:
  - tree
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### Binary Search Tree  
이진트리로, node 의 val 를 기준으로 node.val 보다 값이 작다면 left child 로, 크다면 right child 로 보낸다.  
단점의 경우, node에 insert 하는 순서가 중요하다. 만약, 순서를 생각하지 않고 node 를 추가한다면 tree 가 한쪽으로 쏠려 최악의 경우 linked list 처럼 될 수 있다.

### Key Points to Remember
Remove 동작 시 조건:
1. 삭제할 노드의 왼쪽 자식이 없는 경우:  
   - 삭제할 노드의 오른쪽 자식을 부모 노드와 연결   
2. 삭제할 노드의 오른쪽 자식이 없는 경우:  
   - 삭제할 노드의 왼쪽 자식을 부모 노드와 연결  
3. 삭제할 노드의 왼쪽과 오른쪽 자식이 모두 있는 경우:  
   - 삭제할 노드의 오른쪽 서브트리에서 가장 작은 값을 가진 노드 탐색  
   - 삭제할 노드의 데이터를 해당 노드의 데이터로 교체  
   - 해당 노드를 삭제

### python class 코드
```python

class Item:
    def __init__(self, data={}):
        self.key = list(data.keys())[0]
        self.value = data[self.key]

class Node:
    def __init__(self, data=None):
        self.item = Item(data)
        self.left = None
        self.right = None


class BinarySearchTree:
    def __init__(self):
        self.root = None

    def Insert(self, node):
        if self.root == None:
            self.root = node
        else:
            current = self.root
            while(True):
                if current.item.key > node.item.key:
                    if current.left == None:
                        current.left = node
                        return
                    current = current.left
                elif current.item.key < node.item.key:
                    if current.right == None:
                        current.right = node
                        return
                    current = current.right
                else:
                    current.item = node.item
                    return
                
    def Inorder(self):
        current = self.root
        def _inorder(node):
            if node == None:
                return
            _inorder(node.left)
            print(node.item.key)
            _inorder(node.right)
        _inorder(current)

    def IterGet(self, num):
        current = self.root
        while(current):
            if current.item.key == num:
                return current.item.value
            else:
                if current.item.key > num:
                    current = current.left
                else:
                    current = current.right
        return
    
    def MinKeyNode(self, node):
        current = node
        while(current.left):
            current = current.left
        return current
    
    def Remove(self, num):
        def _remove(node, num):
            if node == None:
                return
            if num < node.item.key:
                node.left = _remove(node.left, num)
            elif num > node.item.key:
                node.right = _remove(node.right, num)
            else:
                if node.left is None:
                    temp = node.right
                    node = None
                    return temp
                elif node.right is None:
                    temp = node.left
                    node = None
                    return temp
                temp = self.MinKeyNode(node.right)
                node.item = temp.item
                node.right = _remove(node.right,temp.item.key)

            return node

        _remove(self.root, num)


bst = BinarySearchTree()    
for i in [5,3,7,1,4,6,8]:
    bst.Insert(Node({i:chr(ord('A')+i)}))

print('Inroder')
bst.Inorder()

print('IterGet')
for i in [5,3,7,1,4,6,8]:
    print(bst.IterGet(i))
print(bst.IterGet(10))

print('Remove')
for i in [5,4,3,7]:
    print(f"Remove:{i}")
    bst.Remove(i)
    bst.Inorder()

```