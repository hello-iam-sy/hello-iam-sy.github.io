---
title: "Singly Linked List"
date: 2024-11-13
last_modified_at: 2024-11-14
categories:
  - linked_list
toc: true
toc_sticky: true
toc_label: "On This Page"
---
### Singly Linked List

![linked_list](/assets/images/posts_img/algorithm/linked-list-1.png "linked list")

### Key Points to Remember
- 파이썬 self 의 경우 클래스 인스턴스 자체를 나타내는 참조. self 는 객체 그 자체이며 객체의 메모리를 가리킴
- Singly Linked List 의 첫 노드의 주소값을 알려주기 위해 head 변수 활용

### Singly Linked List Reverse
Reverse 메소드가 어려워서 따로 남긴다<br>
참고: https://www.geeksforgeeks.org/reverse-a-linked-list/ <br>

![linked-list-reverse](/assets/images/posts_img/algorithm/linked-list-2.png "linked list reverse")

```
원래 Linked List: 1->2->3->NULL
Reverse 이후: 3->2->1->NULL
```

- 반복문을 통해 linked list 순회시 첫 노드의 값만 접근할 수 있다. 
- 첫 노드의 값이 Reverse 이후 1->NULL 로 가야하기 때문에 첫 노드의 next -> NULL 을 가리키도록 한다. 
- 첫 노드의 next 를 바로 NULL 로 치환하면 다음 loop 즉 Node(2) 로 이동하지 못하므로, 임시 변수에 current.next 를 저장해둔다. 
- current.next = prev 로 하여 링크의 방향이 반대가 되도록 설정한다. 
- prev 는 current 로, current 는 저장해뒀던 tmp 로 swap 한다. 

```python
prev = None
current = self.head
while current!= None:
  tmp = current.next
  current.next = prev
  prev = current
  current = tmp
self.head = prev
```

### Singly Linked List python class 코드
```python
class Node():
    def __init__(self, val=None,next=None):
        self.val = val
        self.next = next

class SinglyLinkedList():
    def __init__(self):
        self.head = None

    def PushFront(self, pushNum):
        newNode = Node(pushNum, self.head)
        self.head = newNode        
    
    def PushBack(self, pushNum):
        newNode = Node(pushNum)
        if self.head == None:
            self.head = newNode
        else:
            current = self.head
            while current.next != None:
                current = current.next
            current.next = newNode

    def PrintVal(self):
        print('start')
        printString = ""
        current = self.head
        while current != None:
            printString+=f"{current.val}->"
            current = current.next
        printString+="NULL"
        print(printString)
        print('end')

    def Reverse(self):
        prev = None
        current = self.head
        while current != None:
            tmp = current.next
            current.next = prev
            prev = current
            current = tmp
        self.head = prev

        
    def Find(self, findNum):
        current = self.head
        while current.val != findNum:
            current = current.next
        return current

    def InsertBack(self, addr, insertval):
        insertNode = Node(insertval)
        insertNode.next = addr.next
        addr.next = insertNode

    def Remove(self, addr):
        current = self.head
        while (current != None):
            if current.next == addr:
                break
            else:
                current = current.next
        current.next = current.next.next
        self.head = current


    def PopFront(self):
        self.head = self.head.next

    def PopBack(self):
        current = self.head
        assert (current != None and current.next != None)
        while (current.next.next != None):
            current = current.next
        current.next = None
        self.head = current


node1 = SinglyLinkedList()
node1.PushFront(3)
node1.PrintVal()

node1.PushFront(2)
node1.PrintVal()

node1.PushFront(1)
node1.PrintVal()

node1.PushBack(4)
node1.PrintVal()

node1.Reverse()
node1.PrintVal()

temp = node1.Find(2)
node1.InsertBack(temp, 1000)
node1.PrintVal()

node1.Remove(temp)
node1.PrintVal()

node1.PopFront()
node1.PrintVal()

node1.PopBack()
node1.PrintVal()

```

