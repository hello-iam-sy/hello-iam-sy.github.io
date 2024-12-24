---
title: "LeetCode Study Log: 26"
date: 2024-12-24
last_modified_at: 2024-12-24
categories:
  - leetcode
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### LeetCode 26. Remove Duplicates from Sorted Array
#### **풀이 방법**

Two Pointer 방식을 사용하여, 하나의 포인터는 리스트를 순회(`i`)하고, 다른 포인터는 중복 제거 후 데이터를 저장할 위치를 가리킵니다(`insertIndex`).

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

