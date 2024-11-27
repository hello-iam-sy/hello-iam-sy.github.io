---
title: "Tree 개념 정리"
date: 2024-11-27
last_modified_at: 2024-11-27
categories:
  - tree
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### Tree 개념 정리

Preorder traversal : root -> left -> right  
Inorder traversal : left -> root -> right  
Postorder traversal : left -> right -> root  

**순회 output 예시**  
Inorder traversal: 7 + 4 * 2 - 1  
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
### Key Points to Remember

#### 1. **트리 탐색에서 스택과 큐**
- **스택(Stack)**: 깊이 우선 탐색(DFS) 방식에서 활용. 반복문으로 전위, 중위, 후위 순회를 구현할 때 사용.
- **큐(Queue)**: 너비 우선 탐색(BFS, Level Order Traversal)에서 활용.

---

#### 2. **Preorder Traversal**
- **순서**: Root → Left → Right
- **반복문 구현**:
  1. 스택에 `root`를 먼저 넣는다.
  2. 스택에서 노드를 꺼내 방문.
  3. **오른쪽** 자식을 먼저, **왼쪽** 자식을 나중에 스택에 추가 (스택은 후입선출이므로 순서 뒤집힘).
  4. 최종 방문 순서: `Root → Left → Right`.

---

#### 3. **Inorder Traversal**
- **순서**: Left → Root → Right
- **반복문 구현**:
  1. 현재 노드의 **왼쪽 서브트리**로 계속 내려가며 스택에 쌓는다.
  2. 왼쪽 끝에 도달하면 스택에서 노드를 꺼내 방문 (루트).
  3. 그 노드의 **오른쪽 서브트리**로 이동.
  4. 최종 방문 순서: `Left → Root → Right`.

---

#### 4. **Postorder Traversal**
- **순서**: Left → Right → Root
- **반복문 구현** (스택 2개 사용):
  1. `stack1`에 `root`를 넣는다.
  2. `stack1`에서 노드를 꺼내, **right → left** 순서로 `stack1`에 쌓는다.
  3. 꺼낸 노드를 `stack2`에 저장한다.
  4. `stack2`의 노드를 하나씩 꺼내 방문한다 (스택 구조로 인해 **Left → Right → Root** 순서가 됨).



### Tree python class 코드
```python
class BinaryTree:

    class Node:
        def __init__(self, val, left=None, right = None):
            self.val = val
            self.left = left
            self.right = right

    def __init__(self, root=None):
        self.root = root

    def Sum(self):
        def _sum(node):
            if node is None:
                return 0
            return node.val + _sum(node.left) + _sum(node.right)
        return _sum(self.root)

    def Height(self):
        def _height(node):
            if node is None:
                return 0
            left_height = _height(node.left)
            right_height = _height(node.right)
            return 1 + max(left_height, right_height)

        return _height(self.root)

    def Preorder(self):
        def _preorder(node):
            if node == None:
                return
            print(node.val)
            _preorder(node.left)
            _preorder(node.right)
        _preorder(self.root)
        
    def Inorder(self):
        def _inorder(node):
            if node == None:
                return
            _inorder(node.left)
            print(node.val)
            _inorder(node.right)
        _inorder(self.root)

    def Postorder(self):
        def _postorder(node):
            if node == None:
                return
            _postorder(node.left)
            _postorder(node.right)
            print(node.val)
        _postorder(self.root)

    def Levelorder(self):
        que = [self.root]
        while(que):
            visit = que.pop(0)
            print(visit.val)
            if visit.left:
                que.append(visit.left)
            if visit.right:
                que.append(visit.right)

    def IterativePreorder(self):
        stack = [self.root]
        while(stack):
            visit = stack.pop()
            print(visit.val)
            if visit.right:
                stack.append(visit.right)
            if visit.left:
                stack.append(visit.left)
    
    def IterativeInorder(self):
        current = self.root
        stack = []
        while(current or stack):
            while(current):
                stack.append(current)
                current = current.left
            visit = stack.pop()
            print(visit.val)
            current = visit.right

    def IterativePostorder(self):
        stack1 = [self.root]
        stack2 = []
        while(stack1):
            node = stack1.pop()
            stack2.append(node)
            if node.left:
                stack1.append(node.left)
            if node.right:
                stack1.append(node.right)
        while(stack2):
            visit = stack2.pop()
            print(visit.val)
                
         
n1 = BinaryTree.Node(1)
n2 = BinaryTree.Node(2, n1, None)
n3 = BinaryTree.Node(3)
n4 = BinaryTree.Node(4)
n5 = BinaryTree.Node(5, None, n4)
n6 = BinaryTree.Node(6, n2, n5)

n1.right = n3

tree = BinaryTree(n6)
# print(tree.root.val)
print(tree.Height())
print(tree.Sum())
print("Preorder")
tree.Preorder()
print("Inorder")
tree.Inorder()
print("Postorder")
tree.Postorder()
print("Levelorder")
tree.Levelorder()
print("IterativePreorder")
tree.IterativePreorder()
print("IterativeInorder")
tree.IterativeInorder()
print("IterativePostorder")
tree.IterativePostorder()
```




