---
title: "LeetCode Study Log: 78,48,102 & 287"
date: 2025-01-09
last_modified_at: 2025-01-09
categories:
  - leetcode
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### LeetCode 78. Subsets
- 문제 사이트: [Leetcode 78](https://leetcode.com/problems/subsets/description/)   
- 참고 사이트: [Leetcode 78 Solution](https://www.youtube.com/watch?v=3tpjp5h3M6Y)

#### **풀이 방법**
- 순차적으로 원소를 방문하며, 각 원소가 현재 부분집합에 포함될지 여부를 결정
- 재귀 호출(`dfs`)을 통해 **현재 인덱스 이후의 모든 원소를 탐색**하며, 부분집합을 구성
- `prev` 리스트를 사용해 현재까지 선택된 원소들을 저장하며, **부분집합 완성 시 이를 결과 리스트(`answer`)에 추가**
- 재귀 호출 이후에는 **`prev.pop()`으로 백트래킹**
  
```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        answer = []
        prev = []

        def dfs(idx, prev):
            answer.append(prev.copy())
            for i in range(idx,len(nums)):
                prev.append(nums[i])
                dfs(i+1,prev)
                prev.pop()
        dfs(0, prev)    
        return answer
```
---
### LeetCode 48. Rotate Image
- 행렬에서 90도 회전 공식
```
matrix[c][n-r-1] = copied[r][c]
```
---
### LeetCode 102. Binary Tree Level Order Traversal
- 문제 사이트: [Leetcode 102](https://leetcode.com/problems/binary-tree-level-order-traversal/description/)   
- 참고 사이트: [Leetcode 102 Solution](https://www.youtube.com/watch?v=dEW2za8gd8M)

#### **풀이 방법**
처음에는 각 노드의 레벨 값을 따로 저장하여 풀었으나, 각 레벨의 값을 리스트에 담는 방식으로 개선.
BFS(넓이 우선 탐색) 방식을 사용했으며, 큐를 통해 각 레벨을 탐색.
기존에는 리스트의 `pop(0)`을 사용했지만, `collections.deque`를 사용하면 더 효율적

- **Why `deque`?**
  - `pop(0)`은 리스트의 모든 요소를 왼쪽으로 이동시키므로 시간 복잡도가 **O(n)**
  - `deque.popleft()`는 링크드 리스트 기반으로 **O(1)**의 시간 복잡도를 가진다.

각 노드를 방문 하므로 시간복잡도: O(n)
공간 복잡도: O(n)

```python
from collections import deque
queue = deque([current])
node = queue.popleft()
```

```python
class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        current = root
        from collections import deque
        queue = deque([current])
        answer = []
        if root == None:
            return []
        while queue:
            value = []
            for _ in range(len(queue)):
                node = queue.popleft()
                value.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            answer.append(value)
        
        return answer

```
---
### LeetCode 287. Find the Duplicate Number
- 문제 사이트: [Leetcode 287](https://leetcode.com/problems/find-the-duplicate-number/description/)   
- 참고 사이트: [Leetcode 287 Solution](https://www.youtube.com/watch?v=dEW2za8gd8M)
- 참고 사이트: [Leetcode 287 Floyd](https://programming4myself.tistory.com/150)

#### **풀이 방법**
초기에는 배열을 정렬한 뒤 중복을 탐지하여 **O(NlogN)** 시간 복잡도로 문제를 해결. 하지만, 배열을 **Linked List**처럼 간주하고 Floyd's Tortoise and Hare 알고리즘을 적용하여 **O(N)** 시간 복잡도로 개선된 풀이 구현.

처음에는 두 개의 **while** 루프가 필요한 이유를 이해하기 어려웠지만, 참고 자료를 통해 이해할 수 있었다:

1. **첫 번째 while 루프**: **사이클 감지 단계**  
   - 두 포인터(`slow`와 `fast`)가 배열 내에서 이동하며 교차점을 찾는다.
   - 이 단계는 배열 내에 사이클이 존재함을 보장.

2. **두 번째 while 루프**: **사이클 시작점 찾기 단계**  
   - 한 포인터를 배열의 시작점(`0`)으로, 다른 포인터를 교차점에서 출발시킨다.
   - 두 포인터가 만나는 지점이 중복된 숫자가 저장된 노드의 위치(사이클 시작점)가 된다.

- **시간 복잡도**: 
  - 두 포인터가 배열을 최대 2번 순회하므로 **O(N)**.
- **공간 복잡도**:
  - 배열을 추가로 저장하지 않고 포인터만 사용하므로 **O(1)**.

```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow, fast = 0,0
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break

        slow2 = 0
        while slow != slow2:
            slow = nums[slow]
            slow2 = nums[slow2]
        print(slow)
        return slow
```
