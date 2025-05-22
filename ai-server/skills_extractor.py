from langchain_core.output_parsers import StrOutputParser
from configuration import vector_store, str_model

str_parser = StrOutputParser()
skills_extractor_chain = str_model | str_parser

def extract_context(job_description,num):
    retriever = vector_store.as_retriever(search_kwargs={"k": num})

    """
    Extracts technical skills from a job description.
    """
    skills = skills_extractor_chain.invoke(
        f"You are an assistant that extracts technical skills like JAVA, C++, AWS, React etc. from job descriptions. "
        f"Extract as many technical skills as you can without adding any explanations. Job description: {job_description}"
    )
    
    context = retriever.invoke(skills+"overloading overriding polymorphism\
    inheritance object threading scheduling deadlock semaphores \
    paging indexing database views tree linked list hashmap time-complexity hashtable sorting dfs bfs")
    
    # Combine both contexts
    return context
