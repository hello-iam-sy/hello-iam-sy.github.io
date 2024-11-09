---
title: "Linked List 개념 정리"

categories:
  - linked_tree

toc: true
toc_sticky: true
toc_label: "On This Page"

date: 2024-11-09
last_modified_at: 2024-11-09
---

### Linked List 개념 정리

*현재 HongLab 에서 데이터 구조 강의를 듣고 있어서, 개념 정리겸 남긴다.*

linked list 의 경우 linked representation 인데 이는 sequential reprsentation 과 비교가 된다.

- sequential representation<br>
sequential representation 자료구조로는 배열, 스택, 큐가 있다.<br>
sequential representation 의 경우 하나씩 뽑아먹는다.<br>
중간에 데이터를 delete 하거나 insert 하는 경우, 뒤에 있는 모든 데이터를 앞으로 이동시켜야 하므로 메모리 및 처리 비용이 높아진다.<br>

- linked representation<br>
linked list 의 경우 value 와 다음 노드를 가리키는 포인터를 함께 저장하는 구조이다.<br>
해당 포인터가 그 다음 노드의 위치를 알려주는것의 반복.<br>
가장 마지막의 자료는 null 값을 가르킨다.<br>
delete, insert 시 연결된 포인터만 바꿔주면 되기때문에 구조의 변경이 유연하고 효율적이다.<br>

![linked_list](/assets/images/posts_img/algorithm/linked-list-1.png "linked list")

### Linked List 파이썬

파이썬으로 링크드 리스트를 만들어보겠다.<br>
변수명 정의

| 변수명       | 데이터 타입       | 설명                         | 
|--------------|-------------------|------------------------------|
| val          | Any               | 노드의 value                 | 
| next         | Node or Null      | 다음 노드를 가르키는 pointer |

```python
class ListNode():
    def __init__(self, val=0,next=None):
        self.val = val
        self.next = next

node0 = ListNode(0)
node1 = ListNode(1)
node2 = ListNode(2)
node3 = ListNode(3)
node4 = ListNode(4)
node5 = ListNode(5)

node0.next = node1
node1.next = node2
node2.next = node3
node3.next = node4
node4.next = node5

## print the value of ListNode
current = node0
while(current != None):
    temp = current
    print(temp.val)
    current = current.next
    del temp

```
