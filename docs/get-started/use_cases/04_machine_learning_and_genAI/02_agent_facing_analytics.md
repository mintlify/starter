---
slug: /cloud/get-started/cloud/use-cases/AI_ML/agent_facing_analytics
title: 'Agent facing analytics'
description: 'Build agent-facing analytics systems with ClickHouse Cloud for AI agents and autonomous systems requiring real-time data access'
keywords: ['use cases', 'Machine Learning', 'Generative AI', 'agent facing analytics', 'agents']
sidebarTitle: 'Agent facing analytics'
doc_type: 'guide'
---

## Agent-facing analytics concepts 

### What are "agents"? 

One can think of AI agents as digital assistants that have evolved beyond
simple task execution (or function calling): they can understand context,
make decisions, and take meaningful actions toward specific goals. They
operate in a "sense-think-act" loop (see ReAct agents), processing various
inputs (text, media, data), analyzing situations, and then doing something
useful with that information. Most importantly, depending on the application
domain, they can theoretically operate at various levels of autonomy,
requiring or not human supervision.

The game changer here has been the advent of Large Language Models (LLMs).
While we had the notion of AI agents for quite a while, LLMs like the GPT
series have given them a massive upgrade in their ability to "understand"
and communicate. It's as if they've suddenly become more fluent in "human"
aka. able to grasp requests and respond with relevant contextual information
drawn from the model's training.

### AI agents superpowers: “Tools” 

These agents really shine through their access to “tools”. Tools enhance AI agents
by giving them abilities to perform tasks. Rather than just being conversational 
interfaces, they can now get things done whether it’s crunching numbers, searching
for information, or managing customer communications. Think of it as the difference
between having someone who can describe how to solve a problem and someone who 
can actually solve it.

For example, ChatGPT is now shipped by default with a search tool. This 
integration with search providers allows the model to pull current information
from the web during conversations. This means it can fact-check responses, access
recent events and data, and provide up-to-date information rather than relying 
solely on its training data.

<img src="/images/cloud/onboard/discover/use_cases/ml_ai_05.png" alt="Agents equipped with tools"/>

Tools can also be used to simplify the implementation of Retrieval-Augmented
Generation (RAG) pipelines. Instead of relying only on what an AI model
learned during training, RAG lets the model pull in relevant information
before formulating a response. Here's an example: Using an AI assistant to
help with customer support (e.g. Salesforce AgentForce, ServiceNow AI
Agents). Without RAG, it would only use its general training to answer
questions. But with RAG, when a customer asks about the latest product
feature, the system retrieves the most recent documentation, release notes,
and historical support tickets before crafting its response. This means that
answers are now grounded in the latest information available to the AI
model.

### Reasoning models 

Another development in the AI space, and perhaps one of the most
interesting, is the emergence of reasoning models. Systems like OpenAI o1,
Anthropic Claude, or DeepSeek-R1 take a more methodical approach by
introducing a "thinking" step before responding to a prompt. Instead of
generating the answer straightaway, reasoning models use prompting
techniques like Chain-of-Thought (CoT) to analyze problems from multiple
angles, break them down into steps, and use the tools available to them to
gather contextual information when needed.

This represents a shift toward more capable systems that can handle more
complex tasks through a combination of reasoning and practical tools. One of
the latest examples in this area is the introduction of OpenAI's deep
research, an agent that can autonomously conduct complex multi-step research
tasks online. It processes and synthesizes information from various sources,
including text, images, and PDFs, to generate comprehensive reports within five
to thirty minutes, a task that would traditionally take a human several hours.

<img src="/images/cloud/onboard/discover/use_cases/ml_ai_06.png" alt="Reasoning models"/>

## Real-time analytics for AI agents 

Let's take the case of an agentic AI assistant with access to a
real-time analytics database containing the company's CRM data. When a user asks
about the latest (up-to-the-minute) sales trends, the AI assistant queries the 
connected data source. It iteratively analyzes the data to identify meaningful 
patterns and trends, such as month-over-month growth, seasonal variations, or 
emerging product categories. Finally, it generates a natural language response 
explaining key findings, often with supporting visualizations. When the main 
interface is chat-based like in this case, performance matters since these 
iterative explorations trigger a series of queries that can scan large amounts of
data to extract relevant insights.

Some properties make real-time databases especially suitable for such
workloads. For example, real-time analytics databases are designed to work
with near real-time data, allowing them to process and deliver insights
almost immediately as new data arrives. This is crucial for AI agents, as
they can require up-to-date information to make (or help make) timely and
relevant decisions.

The core analytical capabilities are also important. Real-time analytics
databases shine in performing complex aggregations and pattern detection
across large datasets. Unlike operational databases focusing primarily on
raw data storage or retrieval, these systems are optimized for analyzing
vast amounts of information. This makes them particularly well-suited for AI
agents that need to uncover trends, detect anomalies, and derive actionable
insights.

Real-time analytics databases are also expected to deliver fast
performance for interactive querying, essential for chat-based interaction
and high-frequency explorative workloads. They ensure consistent performance
even with large data volumes and high query concurrency, enabling responsive
dialogues and a smoother user experience.

Finally, real-time analytics databases often serve as the ultimate "data
sinks" effectively consolidating valuable domain-specific data in a single
location. By co-locating essential data across different sources and formats
under the same tent, these databases ensure that AI agents have access to a
unified view of the domain information, decoupled from operational systems.

<img src="/images/cloud/onboard/discover/use_cases/ml_ai_07.png" alt="Classic real-time analytics"/>

<img src="/images/cloud/onboard/discover/use_cases/ml_ai_08.png" alt="Agent real-time analytics"/>

These properties already empower real-time databases to play a vital role
in serving AI data retrieval use cases at scale (e.g. OpenAI's acquisition
of Rockset). They can also enable AI agents to provide fast data-driven
responses while offloading the heavy computational work.

It positions the real-time analytics database as a preferred "context
provider" for AI agents when it comes to insights.

## AI agents as an emerging user persona 

A useful way to think about AI agents leveraging real-time analytics databases 
is to perceive them as a new category of users, or in product manager speak: 
a user persona.

<img src="/images/cloud/onboard/discover/use_cases/ml_ai_09.png" alt="Agents as an emerging user persona"/>

From the database perspective, we can expect a potentially unlimited number of 
AI agents, concurrently running a large number of queries on behalf of users, 
or in autonomy, to perform investigations, refine iterative research and insights,
and execute tasks.

Over the years, real-time databases have had the time to adapt to human 
interactive users, directly connected to the system or via a middleware 
application layer. Classic personas examples include database administrators, 
business analysts, data scientists, or software developers building applications
on top of the database. The industry has progressively learned their usage 
patterns and requirements and organically, provided the interfaces, the operators,
the UIs, the formats, the clients, and the performance to satisfy their various 
use cases.

The question now becomes, are we ready to accommodate the AI agent's workloads? 
What specific features do we need to re-think or create from scratch for these 
usage patterns?

ClickHouse is rapidly providing answers to some of these questions through a host
of features aimed at providing a feature-complete AI experience.

## ClickHouse.ai 

For more information about features coming soon to ClickHouse Cloud, see [ClickHouse.ai](https://clickhouse.com/clickhouse-ai/).
