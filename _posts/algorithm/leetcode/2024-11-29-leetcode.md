---
title: "LeetCode Study Log: 104 & 160"
date: 2024-11-29
last_modified_at: 2024-11-29
categories:
  - linked_list
  - leetcode
  - tree
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### LeetCode 104. Maximum Depth of Binary Tree
#### stack 활용 풀이
- 문제 사이트: [LeetCode 104](https://leetcode.com/problems/maximum-depth-of-binary-tree/description/)  
재귀로 풀었는데, stack 활용한 풀이도 있어 메모  
- **재귀 풀이와 Stack 풀이 모두 시간 및 공간 복잡도는 O(n)**  
  - **재귀 풀이**: 하위 노드에서 깊이를 세어나감.
  - **Stack 풀이**: 상위 루트에서 깊이를 세어나감.  
- **Stack 풀이의 아이디어**:
  - 스택에 `(node, depth)` 형태의 튜플을 추가하여, 깊이를 함께 관리.
  - 스택에서 노드를 꺼내며, 자식 노드에 대해 깊이를 1씩 증가시킴.
```python
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
    
        if root == None:
            return 0
        
        stack = [(root, 1)]
        max_depth = 1
        while stack:
            node, depth = stack.pop()
            max_depth = max(depth, max_depth)
            if node.left:
                stack.append((node.left, depth+1))
            if node.right:
                stack.append((node.right, depth+1))
        print(depth)
        return max_depth
```

---

### LeetCode 160. Intersection of Two Linked Lists
- 문제 사이트: [LeetCode 160](https://leetcode.com/problems/intersection-of-two-linked-lists/description/)  
- 참고 사이트: [LeetCode 160 Solution](https://youtube.com/watch?v=0JHQ26NQcPk)
  
#### **풀이 방법**
1. **Brute Force**
   - **시간복잡도**: O(n * m)
   - `headA`의 각 노드에 대해 `headB`의 모든 노드를 순차적으로 비교

2. **Hash Table 활용**
   - **시간복잡도**: O(n + m), **공간복잡도**: O(n)
   - `headA`의 모든 노드를 Hash Table에 저장.
   - 이후 `headB`의 노드를 순회하며 Hash Table에 포함된 노드인지 확인

3. **효율적인 풀이**
   - **시간복잡도**: O(n + m), **공간복잡도**: O(1)
   - 두 리스트의 길이를 계산한 후, 길이 차이를 없앰
   - 긴 리스트를 짧은 리스트와 같은 길이로 맞춘 뒤, 두 리스트를 동시에 순회하며 노드를 비교
   
3번 해결방법
```python
class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        
        lenHeadA = 0
        lenHeadB = 0
        currentA = headA
        currentB = headB
        while(currentA):
            lenHeadA += 1
            currentA = currentA.next
        while(currentB):
            lenHeadB += 1
            currentB = currentB.next

        diff = abs(lenHeadB-lenHeadA)
        currentA = headA
        currentB = headB
        if (lenHeadA > lenHeadB):
            for i in range(diff):
                currentA = currentA.next
        else:
            for i in range(diff):
                currentB = currentB.next

        while (currentA != currentB):
            currentA = currentA.next
            currentB = currentB.next

        return currentA
```