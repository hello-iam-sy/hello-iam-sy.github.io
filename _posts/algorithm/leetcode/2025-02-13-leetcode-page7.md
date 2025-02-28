---
title: "LeetCode Study Log: 416,863,5,1143 & 894"
date: 2025-02-13
last_modified_at: 2025-02-13
categories:
  - leetcode
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### LeetCode 416. Partition Equal Subset Sum
- 문제 사이트: [Leetcode 416](https://leetcode.com/problems/partition-equal-subset-sum/description/)
- 참고 사이트: [Leetcode 416 Solution](https://youtu.be/5TRcJzeS2cw?si=No55LnPZdxYc-A5j)

#### **풀이 방법**
- sum() 을 했을때 짝수가 아니라면 return False 이다.
- target = sum()//2 로 지정한다.
- len() = target+1 을 가지는 dp 리스트를 생성한다.
- `dp[i]`는 **"부분합 `i`를 만들 수 있는가?"**를 의미한다.
- nums 를 num 으로 순회 -> dp[target], dp[target-1], dp[target-2] , ... dp[num] 의 값을 update.
  - dp[idx] = dp[idx] or dp[idx-num] 으로 하여 기존의 num 값이 축적되도록 한다.
  - 예를들어, target=7, [2,3,...] 일때 dp[2]=True, dp[5]=True(dp[5-3]=dp[2]=True),dp[3]=True
- 이후 dp[-1] 값 반환
  
```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        if sum(nums)%2 == 1:
            return False
        else:
            target = sum(nums)//2
            dp = [False]*(target+1)
            dp[0] = True
            for n in nums:
                for i in range(target, n-1, -1):
                    dp[i] = dp[i] or dp[i-n]
        return dp[-1]
```

### LeetCode 863. All Nodes Distance K in Binary Tree
- 문제 사이트: [Leetcode 863](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/description/)
- 참고 사이트: [Leetcode 863 Solution](https://youtu.be/LQh2g3ygCVU?si=5Drlo7h4ys6daEnQ)

#### **풀이 방법**
- parent, leftChild, rightChile 노드를 count == k 까지 방문한다.
- parent 노드를 방문하기 위해, 부모-자식 map 을 만든다.
- 5->6->5 처럼 다시 방문하는걸 방지하기 위해 isVisited 로 확인한다.
- stack 을 활용. stack = [parentNode, leftChild, rightChild] 를 초기에 넣는다.

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def distanceK(self, root: TreeNode, target: TreeNode, k: int) -> List[int]:
 
        node = root
        parentChildmap = {}
        isVisited = {root.val: False}
        stack = [node]
        while stack:
            parent = stack.pop()
            if parent.left:
                child = parent.left
                parentChildmap[child.val] = parent
                stack.append(child)
            if parent.right:
                child = parent.right
                parentChildmap[child.val] = parent
                stack.append(child)

        for val in parentChildmap:
            isVisited[val] = False

        stack = [(target,0)]
        answer = []
        while stack:
            node, count = stack.pop()
            isVisited[node.val] = True
            if count == k:
                answer.append(node.val)
            if node.left:
                if isVisited[node.left.val] == False:
                    stack.append((node.left, count+1))
            if node.right:
                if isVisited[node.right.val] == False:
                    stack.append((node.right, count+1))
            if node.val in parentChildmap:
                parent = parentChildmap[node.val]
                if isVisited[parent.val] == False:
                    stack.append((parent, count+1))
        return answer
```

### LeetCode 5. Longest Palindromic Substring
- 문제 사이트: [Leetcode 5](https://leetcode.com/problems/longest-palindromic-substring/description/)
- 참고 사이트: [Leetcode 5 Solution](https://youtu.be/yuVLpbgBOnY?si=JumnoDBLAXQT_6xh)

#### **풀이 방법**
- startIdx, endIdx 를 idx 로 초기 설정한다.
- 이후 string[startIdx] == string[endIdx] 라면, startIdx-1, endIdx+1 을 수행한다.
- `maxStartIdx, maxEndIdx 의 차이(팰린드롬 길이)`를 구한 후, 새로운 startIdx, endIdx 의 차이가 더 큰 경우, maxStartIdx, maxEndIdx 를 바꿔준다.
- string 의 length 가 짝수인 경우, cbbd 와 같은 경우, 초기 startIdx, endIdx 값을 `idx`, `idx+1` 로 설정한 후, 다시 로직을 실행한다.

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        maxSIdx, maxEIdx = 0,0
        for idx in range(len(s)):
            sIdx, eIdx = idx, idx
            while sIdx>=0 and eIdx<len(s) and s[sIdx]==s[eIdx]:
                if maxEIdx-maxSIdx < eIdx-sIdx:
                    maxSIdx, maxEIdx = sIdx, eIdx
                sIdx = sIdx-1
                eIdx = eIdx+1

            sIdx, eIdx = idx, idx+1
            while sIdx>=0 and eIdx<len(s) and s[sIdx]==s[eIdx]:
                if maxEIdx-maxSIdx < eIdx-sIdx:
                    maxSIdx, maxEIdx = sIdx, eIdx
                sIdx = sIdx-1
                eIdx = eIdx+1
        return(s[maxSIdx:maxEIdx+1])
```

### LeetCode 1143. Longest Common Subsequence
- 문제 사이트: [Leetcode 1143](https://leetcode.com/problems/longest-common-subsequence/description/)
- 참고 사이트: [Leetcode 1143 Solution](https://youtu.be/OdrC-Zhw6sw?si=vO0B3J_Jws_V9qXD)

#### **풀이 방법**
- `text1`과 `text2`의 인덱스를 올려가며 각 글자를 비교한다.
- 만약 `text1[idx1] == text2[idx2]`이면, **두 인덱스를 모두 증가**시키며 길이를 1 추가한다.
- 글자가 다른 경우:
  - `text1[idx1+1]`과 `text2[idx2]`를 비교
  - `text1[idx1]`과 `text2[idx2+1]`을 비교
  - **둘 중 큰 값을 선택하여 최적의 결과를 찾는다**.

```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        
        from functools import cache

        @cache
        def dfs(idx1, idx2):
            if idx1>=len(text1) or idx2>=len(text2):
                return 0
            if text1[idx1]==text2[idx2]:
                ans = dfs(idx1+1, idx2+1)
                return 1+ ans
            return max(dfs(idx1, idx2+1), dfs(idx1+1, idx2))
        return dfs(0, 0)
```

### LeetCode 894. All Possible Full Binary Trees
- 문제 사이트: [Leetcode 894](https://leetcode.com/problems/all-possible-full-binary-trees/description/)
- 참고 사이트: [Leetcode 894 Solution](https://youtu.be/Ci-82MggDYI?si=SuE2AHgYxCFCBFXW)

#### **풀이 방법**
### **풀이 방법**
- **leftchild와 rightchild의 총 노드 수를 분할**하여 가능한 조합을 탐색한다.
  - 가능한 경우의 수: `(1,5)`, `(3,3)`, `(5,1)`
  - `n=5`일 경우 다시 `(1,3)`, `(3,1)`으로 분할.
  - `n=3`일 경우 다시 `(1,1)`으로 분할.
- **각 left와 right 서브트리의 가능한 노드 구조를 리스트에 저장**하고, 마지막에 모든 경우의 수를 반환한다.

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    from functools import cache
    @cache
    def allPossibleFBT(self, n: int) -> List[Optional[TreeNode]]:
        if n==1:
            return [TreeNode(0)]
        answer = []
        for leftTreeNum in range(1, n, 2):
            rightTreeNum = n-leftTreeNum-1
            print(leftTreeNum, rightTreeNum)

            leftTree = self.allPossibleFBT(leftTreeNum)
            rightTree = self.allPossibleFBT(rightTreeNum)

            for l in leftTree:
                for r in rightTree:
                    root = TreeNode(0)
                    root.left = l
                    root.right = r
                    answer.append(root)
        return answer
```