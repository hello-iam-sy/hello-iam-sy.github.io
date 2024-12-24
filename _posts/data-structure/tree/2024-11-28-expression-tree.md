---
title: "Expression Tree"
date: 2024-11-28
last_modified_at: 2024-12-15
categories:
  - tree
toc: true
toc_sticky: true
toc_label: "On This Page"
---
### Expression Tree
Inorder traversal: ((7 + (4 * 2)) - 1)  
Postorder traversal: 7 4 2 * + 1 -  
```
       -
     /   \
    +     1
   / \
  7   *
     / \
    4   2
```

### python class 코드

```python

class Node:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class ExpressionTree:
    def __init__(self, root):
        self.root = root

    def Postfix(self):
        stack1 = [self.root]
        stack2 = []
        postString = ""
        while stack1:
            node = stack1.pop()
            stack2.append(node)
            if node.left:
                stack1.append(node.left)
            if node.right:
                stack1.append(node.right)
        
        while stack2:
            string = stack2.pop()
            postString += string.val
        return postString

    def Infix(self):
        def _infix(node):
            if node == None:
                return ""
            infixString = ""
            if node.val in ('+','-','*','/'):
                infixString += '('
            infixString += _infix(node.left)
            infixString += node.val
            infixString += _infix(node.right)
            if node.val in ('+','-','*','/'):
                infixString += ')'
            return infixString
        return _infix(self.root)



    
n1 = Node('5', None, None)
n2 = Node('+', None, None)
n3 = Node('3', None, None)
n4 = Node('-', None, None)
n5 = Node('2', None, None)
n6 = Node('*', None, None)
n7 = Node('4', None, None)

n2.left = n1
n2.right = n6
n6.left = n4
n6.right = n7
n4.left = n3
n4.right = n5

tree = ExpressionTree(n2)
print(tree.Postfix())
print(tree.Infix())

```