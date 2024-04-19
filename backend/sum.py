import nltk
import sys
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.probability import FreqDist
import numpy as np
import json
from sklearn.metrics.pairwise import cosine_similarity

def text_summarizer(text, num_sentences):
    # Text into sentences
    sentences = sent_tokenize(text)
    
    # Text into words
    words = word_tokenize(text.lower())
    
    # Removing stop words
    stop_words = set(stopwords.words("english"))
    filtered_words = [word.lower() for word in words if word.lower() not in stop_words and word.isalpha()]
    
    # Calculate word frequencies
    fdist = FreqDist(filtered_words)

    num_keywords = min(5, len(fdist))  # Adjust the number of keywords as needed
    keywords = [word for word, _ in fdist.most_common(num_keywords)]
    
    # Assign scores to sentences based on word frequencies
    sentence_scores = {}
    for i, sentence in enumerate(sentences):
        for word in word_tokenize(sentence.lower()):
            if word in fdist:
                if i in sentence_scores:
                    sentence_scores[i] += fdist[word]
                else:
                    sentence_scores[i] = fdist[word]

    sentence_vectors = []
    for sentence in sentences:
        sent_words = word_tokenize(sentence.lower())
        sent_vector = []
        for word in filtered_words:
            sent_vector.append(sent_words.count(word) / len(sent_words))
        sentence_vectors.append(sent_vector)
    sentence_vectors = np.array(sentence_vectors)
    
    # Calculate cosine similarity between sentences
    similarity_matrix = cosine_similarity(sentence_vectors)
    
    # Calculate sentence scores based on cosine similarity
    cosine_scores = similarity_matrix.sum(axis=1)    

    for i, score in enumerate(cosine_scores):
        if i in sentence_scores:
            sentence_scores[i] += score
        else:
            sentence_scores[i] = score            
    
    # Sort sentences by scores in descending order
    sorted_sentences = sorted(sentence_scores, key=lambda x: sentence_scores[x], reverse=True)
    
    # Select the top `num_sentences` sentences for the summary
    summary_sentences = sorted(sorted_sentences[:int(num_sentences)] ,key=lambda x:x)
    
    # Create the summary
    summary = ' '.join([sentences[i] for i in summary_sentences])

    
    
    return summary,keywords

text=sys.argv[1]
num_sentences=sys.argv[2]


summary,keywords = text_summarizer(text,num_sentences)
dict=json.dumps({"summary":summary,"keywords":keywords})

print(dict)
sys.stdout.flush()