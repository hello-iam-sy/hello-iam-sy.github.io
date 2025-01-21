---
title: "LeetCode Study Log: 75,155 & 326"
date: 2025-01-15
last_modified_at: 2025-01-16
categories:
  - leetcode
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### LeetCode 75. Sort Colors
- 문제 사이트: [Leetcode 75](https://leetcode.com/problems/sort-colors/description/)
- 참고 사이트: [Leetcode 75 Solution](https://www.youtube.com/watch?v=6sMssUHgaBs)

#### **풀이 방법**
- **Three Pointer** 접근 방식:
  1. `start`, `mid`, `end` 포인터를 활용하여 작업.
  2. `mid` 위치의 원소를 기준으로 조건에 따라 작업을 수행:
     - **원소가 0인 경우**: `mid`와 `start`를 스왑, `start`와 `mid`를 1씩 증가.
     - **원소가 1인 경우**: `mid`를 1씩 증가.
     - **원소가 2인 경우**: `mid`와 `end`를 스왑, `end`를 1씩 감소.

```python
class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        start, mid, end = 0,0,len(nums)-1

        while mid <=end:
            ball = nums[mid]
            if ball == 0:
                nums[start], nums[mid] = nums[mid], nums[start]
                start +=1
                mid +=1
            if ball == 1:
                mid +=1
                pass
            if ball == 2:
                nums[mid], nums[end] = nums[end], nums[mid]
                end -=1
``` 



### LeetCode 155. Min Stack
- 문제 사이트: [Leetcode 155](https://leetcode.com/problems/min-stack/description/)
  
#### **풀이 방법**
- 처음에는 getMin() 시, 내부 리스트를 모두 반복문으로 하여 시간이 오래걸렸음
  - **개선된 접근 방식**:
  - `getMin()` 호출 시 매번 최소값을 계산하지 않도록 별도의 `min_stack`을 사용.
  - 스택의 원소 추가/제거 시 `min_stack`도 함께 관리:
    - **push**: 새로운 값이 최소값인 경우 `min_stack`에 추가.
    - **pop**: 스택에서 제거된 값이 `min_stack`의 최솟값과 같은 경우 `min_stack`에서도 제거.

### LeetCode 326. Power of Three
- 문제 사이트: [Leetcode 326](https://leetcode.com/problems/power-of-three/description/)
#### **풀이 방법**
- 3의 제곱수에서 음수가 나오는 경우는 없으므로 0 이하의 값은 예외처리.
- 3으로 나눴을 때 나머지가 0이 아니면 예외처리.
- 최종적으로 n == 1이 되는 경우 True를 반환.
```python
class Solution:
    def isPowerOfThree(self, n: int) -> bool:
        answer = False if n <=0 else True

        while n > 0:
            if n == 1:
                answer = True
                break
            if n % 3 != 0:
                answer = False
                break
            n = n// 3

        return answer
```