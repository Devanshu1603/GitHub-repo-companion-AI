from services.retrival import retrieve_relevant_context
from services.llm_query import generate_response_from_prompt

def code_explainer(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
You are an AI assistant.

Please explain the following code in simple terms. Include details like logic flow, function/class purpose, and how it works.

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def bug_finder(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
You are a bug-finding assistant.

Analyze the code below for logical errors, edge cases, or anti-patterns. Suggest how to fix them.

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def code_reviewer(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
You are a senior code reviewer.

Review the following code for structure, readability, maintainability, performance, and style issues.

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def doc_generator(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
You are a documentation generator bot.

Write clean, professional, and concise documentation, docstrings, or comments for the following code.

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def code_modifier(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
You are an AI code refactoring assistant.

Modify the following code as per the user's request. Show only the modified parts and explain what changed.

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def performance_optimizer(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
You are a performance optimization expert.

Analyze and suggest performance improvements in the following code.

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def security_auditor(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
You are a security auditor.

Audit the code for security vulnerabilities, unsafe practices, and suggest ways to fix them.

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)

def test_case_generator(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
You are a test case generator.

Write meaningful unit tests for the following code using appropriate libraries (e.g. pytest, unittest).

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def dependency_explainer(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
You are an AI assistant for codebase understanding.

Explain the external libraries or dependencies used in the following code, and their roles.

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)

def architecture_mapper(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
You are a software architect.

Based on the code below, describe the system design, architecture, layers (e.g., routes, services), and interactions.

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)