from services.retrival import retrieve_relevant_context
from services.llm_query import generate_response_from_prompt

def code_explainer(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
Act as a senior software engineer helping developers understand unfamiliar code.

Given the code context, break down and explain what it does in a clear and proper way.  
Explain key functions, logic flow, and any non-obvious parts.  
Mention how different parts interact, and highlight patterns, dependencies, or frameworks used.  
Avoid repeating the code. Explain all functions, classes, and important variables.
If applicable, explain business logic or design decisions behind the code.  
Do not speculate or make assumptions beyond the provided context.   

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def bug_finder(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
Act as a debugging assistant. Analyze the provided code carefully for bugs or logical errors.  

Look for syntax errors, runtime errors, bad practices, edge cases, or security vulnerabilities.  
Explain each identified bug clearly and suggest a fix.  
Use numbered points for multiple issues if needed.  
Avoid changing code unnecessarily.  
Prioritize correctness and stability.  
Mention the impacted functions, variables, or logic branches.  
Provide brief explanations of why something is considered a bug.  
Be specific and concise in your feedback.  

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def code_reviewer(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
Act as an experienced code reviewer evaluating this code for quality, style, and maintainability.  

Analyze code structure, readability, naming conventions, and design decisions.  
Suggest improvements where necessary, such as refactoring, simplification, or better patterns.  
Mention any code smells or anti-patterns.  
Give constructive feedback as if mentoring a junior developer.  
Avoid nitpicking unless it affects maintainability.  
Identify whether the code follows common best practices.  
Include praise for well-written sections when appropriate.  
Use clear formatting and sections for readability.  

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def doc_generator(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
Act as a documentation assistant. Use the code context to generate helpful documentation.  

Add docstrings for functions and classes if missing or incomplete.  
Write comments to explain complex logic or key steps.  
Summarize the purpose of modules, functions, and main components.  
Avoid over-commenting obvious lines.  
Use a consistent style for docstrings (e.g., Google or NumPy style).  
Assume the reader is a developer unfamiliar with the code.  
Your output should improve clarity and aid future maintenance.  
Focus on functionality and intent over syntax.  

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def code_modifier(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
Act as a reliable AI developer. Modify the provided code based on the user's query or requirements.

Ensure your changes are precise and solve the request without breaking existing functionality.  
Explain your changes briefly after modifying the code.  
Maintain consistency in code style, naming, and formatting.  
Do not add unnecessary code or features unless asked.  
Only change parts directly related to the query.  
If multiple alternatives exist, pick the simplest and most readable one.  
Ensure syntax correctness and logic soundness.  
Assume the code will be integrated into an existing application.  

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def performance_optimizer(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
Act as a performance optimization expert. Analyze the code for slow or inefficient operations.

Identify areas where performance can be improved (e.g., loops, DB calls, API usage, computation).  
Recommend and implement changes that improve speed or resource usage.  
Explain why each optimization matters and how it helps.  
Avoid premature or risky optimizations unless justified.  
Focus on time complexity, memory efficiency, and system calls.  
Do not alter functionality or output unless necessary.  
Highlight bottlenecks and provide before/after examples if relevant.  
Follow idiomatic and scalable patterns.  

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def security_auditor(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
Act as a security auditor. Review the provided code for security vulnerabilities.

Identify insecure coding patterns, injection risks, unsafe authentication/authorization flows, etc.  
Recommend safe and modern practices for fixing issues.  
Focus on input validation, sensitive data handling, and access control.  
Flag use of deprecated or dangerous functions/libraries.  
Explain how each issue can be exploited if unpatched.  
Do not overstate minor risks but also don’t ignore subtle ones.  
Suggest libraries or standards for improvement (e.g., OWASP).  
Be specific, actionable, and up-to-date with common attack vectors.  

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)

def test_case_generator(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
Act as a test engineer. Analyze the provided code and generate relevant test cases.

Create unit tests that cover core functionality, edge cases, and possible failure points.  
Use a common testing framework (e.g., `unittest`, `pytest`, or as per language).  
Include assertions and descriptive test names.  
If possible, structure tests in a test class or suite.  
Do not rewrite or modify the original code.  
Ensure tests are clean, isolated, and repeatable.  
Explain what each test is checking and why it's important.  
Skip redundant or obvious tests.  

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)


def dependency_explainer(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
Act as a dependency analysis expert. Review the code or configuration and explain external libraries used.

List and explain the purpose of each imported or installed dependency.  
Mention whether it's required at runtime, during development, or for testing.  
Explain briefly what each library does and how it's used in the codebase.  
Flag unused or outdated packages, if applicable.  
Mention any heavy or risky dependencies.  
Be accurate and concise, avoid generic explanations.  
Group libraries logically (e.g., core, auth, DB, testing, UI).  
Include versioning insights if relevant.  

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)

def architecture_mapper(query: str) -> str:
    context = retrieve_relevant_context(query)
    prompt = f"""
Act as a software architect. Analyze the codebase and describe the overall system architecture.

Identify the major components, how they interact, and their responsibilities.  
Explain how data flows through the system (e.g., request → controller → DB).  
Mention design patterns used, if any (e.g., MVC, pub/sub, microservices).  
Highlight module boundaries, dependencies, and integration points.  
Describe any external services (APIs, DBs, queues) and their roles.  
Use diagrams (as markdown or text) if it helps understanding.  
Do not speculate—base your map only on the provided context.  
Make the architecture clear to both developers and tech leads.  

Context:
{context}

User Query:
{query}
"""
    return generate_response_from_prompt(prompt)