---
title: "Kafka 개념 정리"
date: 2024-11-14
last_modified_at: 2024-12-10
categories:
  - kafka
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### KafKa 개념 정리
*인프런에서 카프카 강의에서 관련 개념들 및 앞으로 기억하면 좋을 부분들을 추려 포스팅 한다.*

---

### 카프카란?

---

### 카프카 구성 기본

- **Broker**  
  브로커는 카프카의 서버를 말한다. 단일 서버로 구성될 수도 있고, 여러 서버를 클러스터로 묶어 구성할 수 있다.  
  카프카의 목적이 대용량 데이터 처리이므로, 현업에서는 대부분 클러스터로 운영한다.  
  클러스터 운영 시 보통 3대 이상으로 운영하며, 이는 1대는 운영(primary), 1대는 장애 대비(failover), 1대는 데이터 복사를 위한 것이다.

- **Producer**  
  Producer는 데이터를 생성(Produce)하는 역할이다. 데이터를 브로커에 전달하여 저장하는 역할로 이해할 수 있다.

- **Consumer**  
  Consumer는 Producer와 반대로 데이터를 소비하는 역할이다.

- **Topic**  
  Topic은 카프카에서 데이터를 논리적으로 구분하는 단위로, 메시지가 저장되는 공간이다.  


---

### 주요 개념

- **데이터 저장 및 Partition**  
  데이터를 저장할 때, Topic은 **Partition 단위로 나뉘어 브로커에 저장된다**.  
  각 Partition은 독립적으로 저장되며, **클러스터 환경에서는 Partition이 여러 브로커에 분산**되어 저장된다.  
  데이터를 저장하는 디렉터리 위치는 `server.properties` 파일의 `log.dirs` 설정에서 확인 가능하다.

  디렉터리 구조 예시:  {topic명}-{partition-number}  

데이터를 직접 열어보면 **바이너리 데이터**로 저장되어 읽기 어려운 이유는, **카프카가 데이터를 직렬화(Serialization)** 하여 저장하기 때문이다.

- **Serialization과 Deserialization**  
Producer가 데이터를 보낼 때, 데이터를 직렬화(Serialization)해야 하며, Consumer가 데이터를 읽을 때는 **직렬화 방식에 맞게 역직렬화(Deserialization)** 해야 한다.  
Producer와 Consumer의 직렬화 설정이 일치하지 않으면 메시지를 읽지 못한다.

- **리더 파티션과 팔로워 파티션**  
리더 파티션: 파티션에서 읽기/쓰기 요청을 처리하는 주된 파티션이다.  
팔로워 파티션: 리더 파티션의 데이터를 주기적으로 복사(Replication)하여 백업 역할을 한다.  
리더 파티션은 디스크 I/O가 집중적으로 발생하며, 리더 장애 시 팔로워 중 하나가 리더로 승격된다.  
Kafka Producer 의 acks 옵션:  
- `acks=0` : 리더 파티션에게 데이터가 전송되었는지 확인하지 않고, 일단 push
- `acks=1` : 리더 파티션에 데이터가 잘 쓰여졌는지 확인
- `acks=-1(all)` : 리더 뿐만이 아니라, 팔로워 파티션에게도 데이터가 잘 쓰여졌는지까지 확인
 - min.insync.replicas: acks=-1 인 경우, 최소 몇 개의 ISR 복제본이 데이터를 복제해야 **쓰기 성공**으로 간주할지 결정

---
#### Consumer Lag

  Consumer Lag은 Producer가 데이터를 생성하는 속도보다 Consumer가 데이터를 소비하는 속도가 낮을 때 발생한다.  
  이는 토픽의 파티션 상태와 Consumer의 처리 성능을 모니터링하는 데 중요한 지표로 활용된다.

  **활용 방안**:  
  - **LAG이 증가한 경우**:
    1. **토픽의 파티션 개수를 늘림**으로써 데이터를 병렬로 처리할 수 있도록 한다.
    2. **Consumer 수를 늘려 병렬 처리 속도를 개선**한다.
    3. LAG이 지속적으로 증가한다면 **특정 파티션의 장애를 의심**해볼 수 있다.

  모니터링 툴: Datadog, Confluent Contrl Center, Burrow
  - kafka burrow monitoring architecture  
  
  ![burrow](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FvKgCt%2Fbtrf3sG6KqR%2FFQSktp7J0oqVJOvTW9gnP1%2Fimg.png)

---

#### Kafka Streams

  - Source Processor (E - Extract)  
    Source Processor는 카프카 토픽에서 데이터를 읽어오는 역할  
  - Stream Processor (T - Transform)  
    실시간으로 데이터를 변환하거나 처리하는 역할  
    데이터를 필터링, 매핑, 집계, 조인 등의 작업을 통해 의미 있는 데이터로 변환
  - Sink Processor (L - Load)   
    처리된 데이터를 특정 토픽에 저장하거나 외부 시스템으로 전달하는 역할  
  
  **Kafka Streams의 Co-Partitioning**

    Kafka Streams에서 `KTable`과 `KStream`을 조인하려면 **Co-Partitioning**이 필수    
    이는 두 데이터 소스(`KTable`, `KStream`)가 **동일한 파티션 키**와 **동일한 파티션 개수**를 가져야 한다는 것을 의미  
    

- **Co-Partitioning**:  
  Kafka Streams에서 데이터를 조인하려면, **두 소스 데이터가 동일한 파티션 키와 파티션 개수로 구성**되어 있어야 함

  _관련하여 spark의 shuffing 이 생각이 났다._  
  spark 의 경우는 두 데이터 소스의 파티션 키가 다를 경우, Shuffling을 통해 데이터를 재분배하여 조인하기 때문  

  대신, 카프카 스트림즈에서는 globalKTable 을 지원  
  _이는 Spark의 Broadcasting 을 떠올리게 한다._  
  globalKTable 은 파티션되어 있는 데이터를 materialized view 로 하여 분할되어진 모든 데이터를 메모리에 띄워 join할 수 있도록 한 개념  
  
---
#### Kafka Windowing

Tumbling Window
- **정의**: 
  특정 시간 내의 데이터를 취합. 데이터는 **겹치지 않음**.
- **특징**:
  - 일정한 시간 간격으로 데이터 집계.
  - 각 윈도우는 다른 윈도우와 독립적이며, 중복 없음.
- **예시**: 
  - 데이터 bulk로 insert.
  - 특정 시간의 사용자 통계.
  
![Tumbling Window](https://kafka.apache.org/30/images/streams-time-windows-tumbling.png)


Hopping Window
- **정의**: 
  시간을 기준으로 데이터를 나누고 취합. 윈도우가 **겹치는 부분**이 있음.
- **특징**:
  - 데이터가 여러 윈도우에 중복 포함될 수 있음.
  - 일정 간격(`슬라이드 간격`)마다 새로운 윈도우 시작.
- **예시**: 
  - 매 N 분마다의 데이터 집계.


Sliding Window
- **정의**: 
  다음 이벤트와의 시간 차이를 기준으로 데이터를 취합. 윈도우가 **겹칠 수 있음**.
- **특징**:
  - 이벤트 중심의 윈도우 생성.
  - 다음 이벤트 간의 시간 차이에 따라 윈도우 크기 결정.
- **예시**: 
  - 특정 이벤트 이후 N 분 동안의 모니터링.


Session Window
- **정의**: 
  최대 유휴 시간(`session inactivity gap`) 내의 데이터를 집계. 윈도우 크기가 **가변적**임.
- **특징**:
  - 연속적인 이벤트를 그룹화하여 사용자 중심의 데이터 분석 가능.
  - 이벤트 간 유휴 시간이 설정된 간격을 초과하면 새로운 세션 생성.
- **예시**: 
  - 사용자 행동 패턴 분석.
  - 세션당 활동 시간 집계.



주의점: Kafka Window 시간과 Commit 시간의 불일치
- **문제 상황**:
  - Tumbling Window의 크기가 5초이고, Commit 시간이 3초일 경우.
  - 데이터가 **실제 윈도우 종료 전에 중간 결과로 Commit**될 가능성이 있음.
  
예시:
- **Commit된 데이터**: 
  - 3초 시점: `A: 2개`
  - 6초 시점: `A: 2개`
- **실제 데이터**: 
  - 5초 시점: `A: 4개`
  
해결 방안:
- **Upsert 관리 필요**:
  - 동일 키에 대해 갱신(Update)하거나 삽입(Insert)하는 방식으로 중복 및 불완전한 데이터를 관리.
  - Grace Period를 활용하여 늦게 도착한 데이터도 처리.

---
#### Kafka Connector

- Kafka Streams DSL(예: 데이터 Join, 집계 연산)을 사용하려면 **Source가 Kafka**여야 한다.
- 하지만, **Enterprise 환경**에서는 많은 데이터가 여전히 **RDB**나 다른 외부 저장소에 저장

- **Kafka와 RDB 데이터를 연계**하여 분석해야 하는 상황에서, Kafka Streams는 기본적으로 RDB와 직접 통합할 수 없음
- 따라서, **RDB 데이터를 Kafka Broker로 전송**하는 작업이 필요

- **Kafka Connector**는 다양한 데이터 소스와 Kafka를 쉽게 통합할 수 있는 도구
- RDB, 파일, 클라우드 저장소(S3 등)와 같은 외부 데이터 소스의 데이터를 Kafka로 전송하거나, 반대로 Kafka 데이터를 외부로 내보낼 수 있음


1. **Source Connector**:
   - **외부 데이터 소스 → Kafka**로 데이터를 가져옴
   - 예:
     - MySQL, PostgreSQL 등 RDB 데이터를 Kafka Topic으로 전송

2. **Sink Connector**:
   - **Kafka → 외부 시스템**으로 데이터를 내보냄
   - 예:
     - Kafka 데이터를 Snowflake, S3, RDB에 저장.

- Kafka Connector 실행 방법
- **REST API 사용**:
  - Kafka Connector는 REST API를 통해 설정하고 실행


---

### Kafka 명령어 사용 예시
#### zookeeper 구동

```
bin/zookeeper-server-start.sh config/zookeeper.properties
```

#### kafka 서버 구동

```
bin/kafka-server-start.sh config/server.properties
```

#### kafka topic 생성

```
bin/kafka-topics.sh --create --bootstrap-server my-kafka:9092 --topic hello.kafka
```

#### Kafka Console Producer 실행
```
bin/kafka-console-producer.sh  --bootstrap-server my-kafka:9092 --topic hello.kafka
```

#### Console Consumer로 메시지 확인
```
bin/kafka-console-consumer.sh --bootstrap-server my-kafka:9092 --topic hello.kafka --from-beginning
```
  