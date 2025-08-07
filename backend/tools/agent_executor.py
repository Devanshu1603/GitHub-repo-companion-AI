from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import Runnable
from langchain_openai import ChatOpenAI
from tools.tool_registory import tools

# 🧠 Manually define the ReAct-style prompt
REACT_PROMPT = PromptTemplate.from_template("""
You are an AI agent helping a developer explore a codebase.

You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
{agent_scratchpad}
""")

def get_agent_executor() -> Runnable:
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    agent = create_react_agent(llm=llm, tools=tools, prompt=REACT_PROMPT)
    executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    return executor
