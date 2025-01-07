---
title: "LeetCode Study Log: 26 & 14"
date: 2024-12-24
last_modified_at: 2024-12-24
categories:
  - leetcode
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### LeetCode 26. Remove Duplicates from Sorted Array
- 문제 사이트: [Leetcode 26](https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/)   
- 참고 사이트: [Leetcode 26 Solution](https://youtu.be/MgysxIuGkCA?si=-579Nzfr3NcCbDf2)

#### **풀이 방법**
Two Pointer 방식을 사용하여, 하나의 포인터는 리스트를 순회(`i`)하고, 다른 포인터는 중복 제거 후 데이터를 저장할 위치를 가리킨다(`insertIndex`).

```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        insertIndex = 1
        for i in range(1, len(nums)):
            if nums[i-1] != nums[i]:
                nums[insertIndex] = nums[i]
                insertIndex += 1
        return insertIndex
```

### LeetCode 14. Longest Common Prefix
- 문제 사이트: [Leetcode 14](https://leetcode.com/problems/longest-common-prefix/description/)   
- 참고 사이트: [Leetcode 14 Solution](https://youtu.be/wtOQaovlvhY?si=WceSXE1_9rGSPHEg)
  
#### **풀이 방법**
처음 풀이는 Brute Force 로 풀었는데 이후, efficient method 풀이법을 참고하여 풀이
1. **Brute Force**
  모든 단어를 첫번째 단어와 비교한다.  

   ```python
   class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        first_word = strs[0]
        prefix = ""
        for idx, char in enumerate(first_word):
            for word in strs[1:]:
                if idx >= len(word) or word[idx] != char:
                    return prefix
            else:
                prefix += char
        return prefix
   ```
2. sort 활용 풀이  
   우선 alphabet 순서로 sort 한 후, sorted list 의 맨 첫번째 단어와 맨 뒤의 단어만 비교한다.
   ```python
   class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        sorted_strs = sorted(strs)
        first_word = sorted_strs[0]
        last_word = sorted_strs[-1]
        answer = ""

        for idx, alp in enumerate(first_word):
            if len(last_word) <= idx or last_word[idx] != alp:
                return answer
            else:
                answer += alp
        return answer
   ```

