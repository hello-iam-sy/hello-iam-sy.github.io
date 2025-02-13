---
title: "LeetCode Study Log: 268,49,242,227 & 54"
date: 2025-01-23
last_modified_at: 2025-02-13
categories:
  - leetcode
toc: true
toc_sticky: true
toc_label: "On This Page"
---
### LeetCode 268. Missing Number
- 문제 사이트: [Leetcode 268](https://leetcode.com/problems/missing-number/description/)
- 참고 사이트: [Leetcode 268 Solution](https://youtu.be/FsragroZe3Q?si=iJP4qhEYkqPAdlgb)

#### **풀이 방법**
- 처음에는 `sort` 함수를 활용하여 시간 복잡도가 \(O(Nlog N)\)인 방식으로 해결했다.
- 이후, 시간 복잡도를 \(O(N)\)으로 줄일 수 있는 방법을 발견했다.
  - **비트 연산자의 성질** 활용:
    - 어떤 숫자와 자기 자신을 XOR 연산하면 결과는 항상 `0`.  
      예: a^a = 0
    - `0`과 어떤 숫자를 XOR 연산하면 결과는 그 숫자입니다.  
      예: 0^a = a
- 따라서, `nums` 배열의 모든 값과 `0, 1, ..., n`까지의 숫자를 XOR 연산하면 누락된 숫자만 남게 된다.
  - 예를 들어, `nums = [3, 0, 1]`과 `0, 1, 2, 3`을 XOR 연산하면, 최종 결과는 `2`가 된다.


```python
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        xor = len(nums)
        for idx, num in enumerate(nums):
            xor ^= idx^num
        return xor
```

---
### LeetCode 49. Group Anagrams
- 문제 사이트: [Leetcode 49](https://leetcode.com/problems/group-anagrams/)
- 참고 사이트: [Leetcode 49 Solution](https://youtu.be/Gt0qcNdS8f0?si=wnwyV_jRxhnBDwsk)

#### **풀이 방법**
1. **첫 번째 풀이방법**
   - `strs`의 각 단어를 순회하며, 단어를 알파벳 순으로 정렬.
   - 정렬된 단어를 문자열로 변환한 값을 키로 사용하는 딕셔너리를 이용해 그룹화한다.
   - 정렬된 단어가 딕셔너리에 없으면 새로 추가하고, 있으면 해당 키에 단어를 추가한다.
   - 마지막으로 딕셔너리의 `values()`를 반환하여 결과를 생성합니다.
   - **시간복잡도**: O(N*wlog(w))
   - **공간복잡도**: O(N*w)

2. **두 번째 풀이방법**
   - 첫 번째 풀이와 비슷하지만, 단어를 정렬하지 않고, 고정된 크기(26)의 배열을 사용하여 알파벳의 빈도를 기록한다.
   - 알파벳 빈도 배열을 튜플로 변환하여 딕셔너리의 키로 사용합니다.
   - 동일한 패턴이 없으면 딕셔너리에 새로 추가하고, 있으면 해당 키에 단어를 추가한다.
   - `collections.defaultdict`를 사용하면 키가 없을 경우 자동으로 초기화해줘서 코드를 간결하게 작성할 수 있다.
   - 마지막으로 딕셔너리의 `values()`를 반환하여 결과를 생성합니다.
   - **시간복잡도**: O(N*w)
   - **공간복잡도**: O(N)
  
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        anagrams = {}
        for word in strs:
            sorted_word = str(sorted(word))
            if sorted_word not in anagrams:
                anagrams[sorted_word] = []
            anagrams[sorted_word].append(word)
        # print(anagrams)
        return list(anagrams.values())
```
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        from collections import defaultdict
        anagrams = defaultdict(list)
        for word in strs:
            alphabet = [0]*26
            for letter in word:
                alphabet[ord(letter) - ord('a')] +=1
            anagrams[tuple(alphabet)].append(word)
        return list(anagrams.values())
```

---
### LeetCode 242. Valid Anagram
- 문제 사이트: [Leetcode 242](https://leetcode.com/problems/valid-anagram/)

#### **풀이 방법**
- Valid Anagram 인 확인 idea: s를 sort 한 것과 t 를 sort 한 것이 같아야 한다.

---

### LeetCode 227. Basic Calculator II
- 문제 사이트: [Leetcode 227](https://leetcode.com/problems/basic-calculator-ii/)
- 참고 사이트: [Leetcode 268 Solution](https://wellsw.tistory.com/154)

#### **풀이 방법**
- `s.replace(" ", "")`를 사용하여 문자열 내의 모든 공백을 제거한다.
- `for` 문을 사용하여 문자열을 순회하면서 숫자를 추출하고, 연산자를 만나면 연산을 수행한다.
- `+`, `-` 연산자는 숫자를 `stack`에 추가하고, `*`, `/` 연산자는 `stack`의 마지막 값을 꺼내 계산 후 다시 `stack`에 넣는다.
- 맨 앞에 `+`가 생략된 것으로 보고 처리한다.
- `int()`를 사용하여 `/` 연산 후 **소수점 이하를 버리고 내림(floor division) 처리**한다.
   - **`-7.5`를 내림하면 `-7`이 되도록 `int()`를 사용** (`stack.append(int(tmp / num))`).

```python
class Solution:
    def calculate(self, s: str) -> int:
        s = s.replace(" ", "")

        operator = "+"
        num = 0
        stack = []
        for idx, char in enumerate(s):
            if char.isnumeric():
                num = 10*num + int(char)

            if not char.isnumeric() or idx==len(s)-1:
                if operator == "+":
                    stack.append(num)
                elif operator =="-":
                    stack.append(-num)
                elif operator == "*":
                    tmp = stack.pop()
                    stack.append(tmp*num)
                else:
                    tmp = stack.pop()
                    stack.append(int(tmp/num))
                num = 0
                operator = char

        # print(stack)
        return (sum(stack))
```

---

### LeetCode 54. Spiral Matrix
- 문제 사이트: [Leetcode 54](https://leetcode.com/problems/spiral-matrix/description/)

#### **풀이 방법**
**네 방향 이동을 정의 (`move` 리스트 활용)**  
- **오른쪽 `[0,1]` → 아래 `[1,0]` → 왼쪽 `[0,-1]` → 위 `[-1,0]`** 순으로 이동.
- `delta` 변수를 사용하여 이동 방향을 조절.

**`checkFlag`를 사용해 방문 여부 체크**
- `checkFlag = [[False]*n for _ in range(m)]`  
- 방문한 위치는 `True`로 표시.

**`while not all(all(row) for row in checkFlag)`로 모든 요소 방문할 때까지 반복**
- `i, j`가 행렬의 범위를 벗어나거나 방문한 경우 방향을 전환.
- `delta`를 업데이트하여 다음 이동 방향으로 변경.

```python
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        move = [[0,1], [1,0], [0, -1], [-1, 0]]
        m, n = len(matrix), len(matrix[0])
        checkFlag = [[False]*n for _ in range(m)]
        print(checkFlag)
        output = []
        i, j = 0, 0
        delta = 0
        output.append(matrix[i][j])
        checkFlag[i][j] = True
        while not all(all(row) for row in checkFlag):
            nexti = i+ move[delta][0]
            nextj = j+ move[delta][1]
            if nexti >= m or nextj >=n or checkFlag[nexti][nextj]==True:
                delta +=1
                if delta >= len(move):
                    delta = 0
            else:
                i, j = nexti, nextj
                output.append(matrix[i][j])
                checkFlag[i][j] = True
        return output
```