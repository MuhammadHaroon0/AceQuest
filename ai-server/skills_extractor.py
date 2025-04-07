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
    
    context = retriever.invoke("abstraction encapsulation overloading overriding polymorphism\
    inheritance object static recursion threading process scheduling deadlock semaphores \
    paging indexing views stored procedure stack heap binary search tree graph vector arraylist linked \
    list hashmap time complexity hashtable sort dfs bfs "+skills)
    
    # Combine both contexts
    return context
