---
title: "LeetCode Study Log: 141 & 234"
date: 2024-11-18
last_modified_at: 2024-11-19
categories:
  - linked_list
  - leetcode
toc: true
toc_sticky: true
toc_label: "On This Page"
---
### LeetCode 141. Linked List Cycle
#### 일반 풀이
- 문제 사이트: [LeetCode 141](https://leetcode.com/problems/linked-list-cycle/description/)
- **아이디어**: 파이썬 `set`을 사용하여 각 노드의 주소를 저장. 새로운 노드가 `set`에 이미 존재한다면 cycle로 판단.
- **주의**: 처음 풀 때 `list`를 사용해 시간 복잡도에서 손해를 봤음. 이와 같은 **데이터 저장 및 확인 로직에서는 항상 `set`을 사용하는 것을 고려할 것.**

```python
addr_set = set()
while (head):
   if head in addr_set:
      return True
   addr_set.add(head)
   head = head.next
return False

```


- **참고 자료**: [Wikipedia - Floyd's Cycle Detection](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare)
- **아이디어**:
  1. 두 개의 포인터를 사용:
     - **거북이 포인터 (`slow`)**: 한 번에 한 칸씩 이동.
     - **토끼 포인터 (`fast`)**: 한 번에 두 칸씩 이동.
  2. 순환이 있는 경우:
     - 두 포인터는 결국 내부에서 만나게 된다.
  3. 순환이 없는 경우:
     - `fast` 포인터가 리스트의 끝(`None`)에 도달하며 종료.

- **알고리즘의 시간 복잡도**:
  - 시간 복잡도: **O(n)** (포인터들이 한 번만 순회)
  - 공간 복잡도: **O(1)** (추가 공간 사용 없음)

```python
slow, fast = head, head
while fast and fast.next:
   slow = slow.next
   fast = fast.next.next
   if slow == fast:
      return True
return False

```

### LeetCode 234. Palindrome Linked List
- 문제 사이트: [LeetCode 234](https://leetcode.com/problems/palindrome-linked-list/description/)
- 이 부분은 palindrome 판별 부분만 기억 필요하여 메모
- **파이썬에서 palindrome 판별하는 방식**:
```python
randomList == randomList[::-1]
```

- **파이썬에서 ASCII 변환**
```python
ord('a')
chr(ord('a'))
``` 