---
title: "Kafka 개념 정리"
date: 2024-11-14
last_modified_at: 2024-11-14
categories:
  - kafka
toc: true
toc_sticky: true
toc_label: "On This Page"
---

### KafKa 개념 정리
*인프런에서 카프카 강의를 약 50% 들은 시점에서 관련 개념들 및 앞으로 기억하면 좋을 부분들을 추려 포스팅 한다.*
### 카프카란?

### 카프카 구성 기본
- broker
  브로커는 카프카의 서버를 말한다. 단일 서버로 구성될 수도 있고, 여러 서버를 cluster 로 묶어 구성할 수 있다.
  카프카의 목적이 대용량 데이터 처리이므로 현업에서는 대부분 클러스터로 운영한다. 클러스터 운영시 3대 이상으로 운영한다. 1대 운영, 1대 fail, 1대 데이터 복사
- producer
  producer 는 말그대로 데이터를 produce 하는 개념이다. 데이터를 broker 서버에 집에 넣는 개념이라고 이해했다.
- consumer
  consumer 는 producer 와는 반대로 데이터를 소비하는 입장이다.
- topic
  topic 은 카프카에서 데이터를 의미한다. RDB 에서 테이블과 동일 level 로 이해하였다.

### 카프카 이해 내용
- 데이터를 저장할때 topic 은 브로커의 서버에 저장이 된다. 물론 저장이되는 위치는 HDFS와 같은 external mounted point 일 수 있음. 저장이 될때 topic 이 partition 으로 나뉘어 저장된다. 마치 Hive 에서 HDFS 에 파일을 저장할 때 partition key 에 나뉘어서 데이터를 저장하는 것처럼
- 데이터를 broker 에 저장하는데 해당 위치는 기본적으로 *** 이다. 안에 dir 구조를 봐보면 ** 이다. 대신에 파일을 열어서 데이터를 보려고 하니 깨져보인다. 왜냐면 카프카는 기본적으로 data 를 serialization 해서 바이너리로 저장하기 때문이다. serialization 부분은 producer - consumer 에서 option 에서도 중요한데, 둘의 쿵짝이 맞아야 하기때문이다. producer 에서 stringserialization 으로 데이터를 변환 consumer 에서도 해당 변환을 해야하기때문이다.
- 관련하여 kafka topic 을 지을때 consumer 에서 데이터를 가져가기편하라고 serailization 의 종류를 이름에 반영하기도 한다.
- __consumer_offsets 에 대하여. kafka 의 경우 데이터를 consumer 에서 소비한다. ** offset 에 대한 정의? offset 은 레코드 인가에 관해서 좀 더 알아보기
- 

  