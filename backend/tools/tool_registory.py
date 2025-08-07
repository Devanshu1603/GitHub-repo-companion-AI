from langchain.tools import Tool
from tools.multi_tool import code_explainer, bug_finder , code_reviewer, doc_generator, code_modifier, performance_optimizer, security_auditor, test_case_generator, dependency_explainer, architecture_mapper

tools = [
    Tool.from_function(
        func=code_explainer,
        name="CodeExplainer",
        description="Explains any code snippet, function, or file in simple language."
    ),
    Tool.from_function(
        func=bug_finder,
        name="BugFinder",
        description="Finds bugs, issues, or potential flaws in the given code."
    ),
    Tool.from_function(
        func=code_reviewer,
        name="CodeReviewer",
        description="Reviews code for quality, structure, and maintainability."
    ),
    Tool.from_function(
        func=doc_generator,
        name="DocGenerator",
        description="Generates documentation or comments for the code."
    ),
    Tool.from_function(
        func=code_modifier,
        name="CodeModifier",
        description="Modifies or refactors code based on user request."
    ),
    Tool.from_function(
        func=performance_optimizer,
        name="PerformanceOptimizer",
        description="Optimizes the code performance."
    ),
    Tool.from_function(
        func=security_auditor,
        name="SecurityAuditor",
        description="Audits the code for security vulnerabilities."
    ),
    Tool.from_function(
        func=test_case_generator,
        name="TestCaseGenerator",
        description="Generates unit or integration test cases."
    ),
    Tool.from_function(
        func=dependency_explainer,
        name="DependencyExplainer",
        description="Explains libraries, packages, or dependencies used in the code."
    ),
    Tool.from_function(
        func=architecture_mapper,
        name="ArchitectureMapper",
        description="Describes the architectural structure and module interaction."
    )
]