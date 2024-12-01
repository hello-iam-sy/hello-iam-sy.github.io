---
title: "Kafka 개념 정리"
date: 2024-11-14
last_modified_at: 2024-12-01
categories:
  - kafka
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### KafKa 개념 정리
*인프런에서 카프카 강의를 약 50% 들은 시점에서 관련 개념들 및 앞으로 기억하면 좋을 부분들을 추려 포스팅 한다.*

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
  