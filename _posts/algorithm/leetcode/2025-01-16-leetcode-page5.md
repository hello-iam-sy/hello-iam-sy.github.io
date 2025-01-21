---
title: "LeetCode Study Log: 215,62,103,200 & 101"
date: 2025-01-16
last_modified_at: 2025-01-21
categories:
  - leetcode
toc: true
toc_sticky: true
toc_label: "On This Page"
---
### LeetCode 215
- 문제 사이트: [Leetcode 215](https://leetcode.com/problems/kth-largest-element-in-an-array/description/)
- 참고 사이트: [Leetcode 215 Solution](https://www.youtube.com/watch?v=TKgrAvgu82c)

#### **풀이 방법**
- 총 3가지의 방식으로 풀 수 있다. sort 함수사용, hash 사용, quickselect 사용
- quickselect 사용시 test case 에 최악의 상황이 포함되어 있어, 연습은하되, 제출은 hash 버전으로 했다.
##### `hash` 사용
- **장점**: 안정적이며 최악의 경우에도 성능이 보장된다. 특히 힙을 사용하면 \(O(nlogk)\)의 시간 복잡도로 해결 가능.
##### `Quickselect` 사용
`Quickselect` 알고리즘을 통해 원하는 위치에 있는 값을 효율적으로 찾는 방식.
- **장점**: 평균적으로 \(O(n)\)의 시간 복잡도를 가집니다.
- **단점**: **최악의 경우** \(O(n^2)\)의 성능 저하가 발생할 수 있다.
  

```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        from heapq import heappop, heappush
        heap = []

        for n in nums:
            if len(heap) <k:
                heappush(heap, n)
            else:
                if heap[0] < n:
                    heappop(heap)
                    heappush(heap, n)
        return(heap[0])
```
```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        import random
        def find_at(low, high, idx):
            pivot = partition(low, high)
            if idx < pivot:
                return find_at(low, pivot - 1, idx)
            if idx > pivot:
                return find_at(pivot + 1, high, idx)
            return nums[idx]

        def partition(low, high):
            p = low
            for i in range(low, high):
                if nums[i] < nums[high]:
                    nums[i], nums[p] = nums[p], nums[i]
                    p += 1
            nums[high], nums[p] = nums[p], nums[high]
            return p

        return find_at(0, len(nums) - 1, len(nums) - k)
        
```
### LeetCode 62. Unique Paths
- 문제 사이트: [Leetcode 62](https://leetcode.com/problems/unique-paths/description/)
- 참고 사이트: [Leetcode 62 Solution](https://www.youtube.com/watch?v=dXAIBrWbpoY&t=729s)

#### **풀이 방법**

- 처음에는 **Time Limit Exceeded**가 발생했으나, **memoization** 기법을 적용하여 해결 가능하다는 점을 알았다.
- **memoization**은 이전에 계산한 값을 저장하여, 중복 계산을 방지하고 속도를 최적화하는 기법.
- **(i, j)** 좌표에서의 경로 수는 **(i-1, j)** 좌표에서의 경로 수와 **(i, j-1)** 좌표에서의 경로 수의 합으로 표현된다.
  - 수식: `dfs(i, j) = dfs(i-1, j) + dfs(i, j-1)`
- Python에서는 **`from functools import lru_cache`** 데코레이터를 사용하여, 간단하고 효율적으로 메모이제이션을 구현할 수 있다.
  - `lru_cache`는 C로 구현된 최적화된 라이브러리로, **해시 테이블**을 사용하여 중복 계산을 피한다.
  - 수동으로 딕셔너리를 사용하는 방법보다 더 빠르고 간결하다.

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        memo = {}
        def dfs(i, j):
            if (i, j) in memo:
                return memo[(i, j)]
            if i == 0 and j == 0:
                return 1
            if i < 0 or j < 0:
                return 0
            memo[(i, j)] = dfs(i-1, j) + dfs(i, j-1)
            return memo[(i, j)]
        return dfs(m-1, n-1)
```
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        from functools import lru_cache
        @lru_cache(None)
        def dfs(i, j):
            if i == 0 and j == 0:
                return 1
            if i < 0 or j < 0:
                return 0
            return dfs(i-1, j) + dfs(i, j-1)

        return dfs(m-1, n-1)
            
```

### LeetCode 103. Binary Tree Zigzag Level Order Traversal
- 문제 사이트: [Leetcode 103](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/description/)
- 참고 사이트: [Leetcode 103 Solution](https://velog.io/@dlwhsk0/LeetCodePython-103.-Binary-Tree-Zigzag-Level-Order-Traversal)

#### **풀이 방법**
- **`collections.deque` 사용**: `deque`는 **queue** 구현에 적합하며, `popleft()`를 사용하여 빠른 삭제가 가능.
- **`flag` 활용**: 각 레벨마다 **순서 변경**(정방향 ↔ 역방향)을 위한 boolean 플래그를 사용.
- **Pythonic 코드**: 파이썬의 **if 조건 한줄 코딩**을 활용하여 가독성 높이기.
- 시간복잡도: 모든 노드를 한번만 방문하므로 **`O(N)`**

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        from collections import deque
        current = root
        queue = deque([current])
        answer = []
        flag = True
        if root == None:
            return []
        while queue:
            tmp = []
            new_queue = []
            while queue:
                q = queue.popleft()
                tmp.append(q.val)
                if q.left: new_queue.append(q.left)
                if q.right: new_queue.append(q.right)
            if flag: answer.append(tmp)
            else: answer.append(tmp[::-1])
            queue += new_queue
            flag = not flag
        return answer

```

### LeetCode 200. Number of Islands
- 문제 사이트: [Leetcode 200](https://leetcode.com/problems/number-of-islands/)
- 참고 사이트: [Leetcode 200 Solution](https://www.youtube.com/watch?v=FidNa-kRF1I&t=417s)

#### **풀이 방법**
- `for` 문을 사용해 `grid`를 순회하며, 값이 `"1"`인 셀을 발견할 경우 해당 지점을 중심으로 DFS.
- DFS를 통해 인접한 `"1"`을 모두 방문 처리하여 하나의 섬(`island`)의 연속성 확인.
- 방문한 셀은 `"-1"`로 마킹하여 중복 탐색을 방지.
  

```python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        m = len(grid)
        n = len(grid[0])
        count = 0
        move = [(0,1),(1,0),(-1,0),(0,-1)]
        def isIsland(i, j):
            if i >= m or j>=n or i<0 or j <0:
                return
            if grid[i][j] != "1":
                return
            grid[i][j] = "-1"
            for x,y in move:
                isIsland(i+x,j+y)
            return 1
        
        for i in range(m):
            for j in range(n):
                if grid[i][j] =="1":
                    count += isIsland(i,j)
        return count
```

### LeetCode 101. Symmetric Tree
- 문제 사이트: [Leetcode 101](https://leetcode.com/problems/symmetric-tree/description/)
- 참고 사이트: [Leetcode 101 Solution](https://velog.io/@ysinfrance/101.-Symmetric-Tree)

#### **풀이 방법**(Queue 활용)
- BFS를 기반으로 `queue`를 활용하여 이진 트리의 대칭성을 확인.
  
```python
class Solution:
     def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        current = root
        
        from collections import deque
        queue = deque([current])
        while queue:
            numb = []
            new_queue = []
            for q in queue:
                ele = q.left.val if q.left is not None else None
                numb.append(ele)
                ele = q.right.val if q.right is not None else None
                numb.append(ele)
            if numb != numb[::-1]:
                return False
            while queue:
                node = queue.popleft()
                if node.left != None: new_queue.append(node.left)
                if node.right != None: new_queue.append(node.right)
            queue += new_queue
        return True
```

#### **풀이 방법**(DFS 활용)
- 재귀를 사용하여 트리의 좌우 대칭성을 확인.
- node 의 left 와 right 값을 비교하는 개념.
- recusion 으로하면 left.left 와 right.right 을 비교하면 트리를 내려갈 수 있다.
```python
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        node = root
        def isMirror(left, right):
            if left == None and right == None:
                return True
            elif left == None or right == None:
                return False
            else:
                return (left.val == right.val) and isMirror(left.left, right.right) and isMirror(left.right, right.left)
        if root == None:
            return True

        return isMirror(node.left, node.right)
```