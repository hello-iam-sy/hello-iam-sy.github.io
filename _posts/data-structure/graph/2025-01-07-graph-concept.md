---
title: "Graph 정리"
date: 2025-01-07
last_modified_at: 2024-01-07
categories:
  - graph
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### Graph 개념 정리
- **정점(Vertex)**: 그래프의 구성 요소. 그래프 내의 개별적인 데이터 포인트.
- **간선(Edge)**: 두 정점 간의 관계를 나타냄.
- **인접 행렬(Adjacency Matrix)**: 정점 간의 연결 정보를 2차원 배열로 표현.
  - **장점**: 간선의 유무를 빠르게 확인 가능.
  - **단점**: 공간복잡도가 높음 \(O(V^2)\).
- **탐색 알고리즘**
  - **DFS(Depth First Search)**: 깊이 우선 탐색으로 그래프의 분기를 최대한 깊게 탐색 후 백트래킹.
  - **BFS(Breadth First Search)**: 너비 우선 탐색으로 정점의 모든 인접 노드를 먼저 방문.

---

### Key Points to Remember
- **DFS 구현**
  - **Recursive**: 함수 호출 스택 활용.
  - **Iterative**: 명시적으로 스택을 사용하여 탐색.
- **BFS 구현**
  - 큐(queue) 자료구조를 활용하여 탐색.
- **파이썬 코드 작성 시 유의점**
  - **정점 초기화**: `self.vertices_ = [Vertex() for _ in range(self.max_vertices_)]`로 초기화.
    - 이 방식은 각 정점이 독립적인 객체를 가지도록 보장.
    - `self.vertices_ = [Vertex()] * n`로 초기화할 경우, 모든 원소가 동일한 객체를 참조하게 되어 의도치 않은 동작이 발생.

---
### Graph python class 코드
```python

class Vertex:
    def __init__(self):
        self.item = 0

class AdjMatGraph:
    def __init__(self, max_vertices):
        self.max_vertices_ = max_vertices
        self.matrix_ = []
        for r in range(max_vertices):
            self.matrix_.append([])
            for c in range(max_vertices):
                self.matrix_[r].append(0)

        self.vertices_ = [Vertex() for _ in range(self.max_vertices_)]

        self.n_ = 0
        self.visited_ = [False] * self.max_vertices_
    
    def PrintMatrix(self):
        if self.n_:
            for r in range(self.n_):
                for c in range(self.n_):
                    print(self.matrix_[r][c], end=", ")
                print()
        else:
            print("Empty")

    def InsertVertex(self, item):
        self.vertices_[self.n_].item = item
        self.n_ += 1

    def Capacity(self):
        return self.max_vertices_
    
    def InsertEdge(self, u, v):
        self.matrix_[u][v] = 1

    def ResetVisited(self):
        self.visited_ = [False] * self.max_vertices_

    def DepthFirstTraversal(self):
        print("DepthFirstTraversal")
        self.ResetVisited()
    
        def dfs(visit):
            if self.visited_[visit]:
                return
            self.visited_[visit] = True
            print(f"visited: {visit}")
            for p in range(self.max_vertices_):
                if self.matrix_[visit][p] == 1 and self.visited_[p] == False:
                    dfs(p)
        dfs(0)


    def IterDFT(self):
        print("IterDFT")
        self.ResetVisited()
        stack = [0]
        self.visited_[0] = True

        while stack:
            visit = stack.pop()
            print(f"visited: {visit}")
            for p in range(self.max_vertices_):
                if self.matrix_[visit][p] == 1 and self.visited_[p] == False:
                    self.visited_[p] = True
                    stack.append(p)
            

    def BreadthFirstTraversal(self):
        print("BreadthFirstTraversal")
        self.ResetVisited()
        queue = [0]
        self.visited_[0] = True

        def bfs():
            if not queue:
                return
            visit = queue.pop(0)
            print(f"visited: {visit}")
            for p in range(self.max_vertices_):
                if self.matrix_[visit][p] == 1 and self.visited_[p] == False:
                    self.visited_[p] = True
                    queue.append(p)
            bfs()
            
        bfs()

    

g = AdjMatGraph(7)

for i in range(g.Capacity()):
    print(i)
    g.InsertVertex(i)

g.InsertEdge(0,2); g.InsertEdge(2,0)
g.InsertEdge(0,1); g.InsertEdge(1,0)
g.InsertEdge(1,4); g.InsertEdge(4,1)
g.InsertEdge(1,3); g.InsertEdge(3,1)
g.InsertEdge(2,4); g.InsertEdge(4,2)
g.InsertEdge(3,6); g.InsertEdge(6,3)
g.InsertEdge(4,6); g.InsertEdge(6,4)
g.InsertEdge(5,6); g.InsertEdge(6,5)

g.PrintMatrix()

g.DepthFirstTraversal()

g.IterDFT()
g.BreadthFirstTraversal()
```

---

### Graph python class 코드 (linked-list 활용)
- self.list_[0]: ->Node(1) -> Node(2) -> None
  
```python

class Vertex:
    def __init__(self):
        self.item = 0

class Node:
    def __init__(self, vertex=-1, next=None):
        self.vertex = vertex
        self.next = next
    
class AdjListGraph:
    def __init__(self,max_vertices):
        self.max_vertices_ = max_vertices
        self.vertices_ = [Vertex() for _ in range(self.max_vertices_)]
        self.list_ = [None for _ in range(self.max_vertices_)]
        self.n_ = 0
        self.visited_ = [False] * self.max_vertices_

    def InsertVertex(self, item):
        self.vertices_[self.n_].item = item
        self.n_ +=1

    def Capacity(self):
        return self.max_vertices_
    
    def InsertEdge(self, u, v):
        temp = Node(v, self.list_[u])
        self.list_[u] = temp

    def Print(self):
        for v in range(self.n_):
            print(f"{self.vertices_[v].item} : ", end="")
            current = self.list_[v]
            while current:
                print(self.vertices_[current.vertex].item, end = " ")
                current = current.next
            print()
    def ResetVisited(self):
        self.visited_ = [False] * self.max_vertices_

    def DepthFirstTraversal(self):
        print("DepthFirstTraversal")
        self.ResetVisited()
        def dfs(visit):
            self.visited_[visit] = True
            print(f"visited: {visit}")
            current = self.list_[visit]
            while current:
                w = current.vertex
                if self.visited_[w] == False:
                    dfs(w)
                current = current.next

        dfs(0)

    def IterDFT(self):
        print("IterDFT")
        self.ResetVisited()
        visit = 0
        stack = [visit]
        while stack:
            visit = stack.pop()
            current = self.list_[visit]
            if self.visited_[visit] == False:
                print(f"visited: {visit}")
                self.visited_[visit] = True
                while current:
                    stack.append(current.vertex)
                    current = current.next

    def BreadthFirstTraversal(self):
        print("BreadthFirstTraversal")
        self.ResetVisited()
        visit = 0
        queue = [visit]
        self.visited_[0] = True
        while queue:
            visit = queue.pop(0)
            current = self.list_[visit]
            print(f"visited: {visit}")
            while current:
                if self.visited_[current.vertex] == False:
                    self.visited_[current.vertex] = True
                    queue.append(current.vertex)
                current = current.next


g = AdjListGraph(7)
for i in range(g.Capacity()):
    g.InsertVertex(i)

g.InsertEdge(0,2); g.InsertEdge(2,0)
g.InsertEdge(0,1); g.InsertEdge(1,0)
g.InsertEdge(1,4); g.InsertEdge(4,1)
g.InsertEdge(1,3); g.InsertEdge(3,1)
g.InsertEdge(2,4); g.InsertEdge(4,2)
g.InsertEdge(3,6); g.InsertEdge(6,3)
g.InsertEdge(4,6); g.InsertEdge(6,4)
g.InsertEdge(5,6); g.InsertEdge(6,5)

g.Print()

g.DepthFirstTraversal()
g.IterDFT()
g.BreadthFirstTraversal()
```
