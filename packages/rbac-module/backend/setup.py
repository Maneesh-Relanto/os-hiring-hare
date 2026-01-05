from setuptools import setup, find_packages

setup(
    name="rbac-module",
    version="1.0.0",
    description="Backend utilities and models for RBAC module",
    author="Your Name",
    author_email="your.email@example.com",
    url="https://github.com/your-org/rbac-module",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.100.0",
        "sqlalchemy>=2.0.0",
        "pydantic>=2.0.0",
        "python-jose[cryptography]>=3.3.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-asyncio>=0.21.0",
            "black>=23.0.0",
            "mypy>=1.0.0",
        ],
    },
    python_requires=">=3.10",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Framework :: FastAPI",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Security",
    ],
    keywords="rbac permissions roles authorization fastapi",
    project_urls={
        "Bug Reports": "https://github.com/your-org/rbac-module/issues",
        "Source": "https://github.com/your-org/rbac-module",
        "Documentation": "https://docs.rbac-module.dev",
    },
)
