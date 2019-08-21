## Script to Generate CSV from PubMed
The script scraps vital information using [`sorgerlab/indra`](https://github.com/sorgerlab/indra) from `nxml` files downloaded from the NCBI repository. 

### How to download raw files  
The script requires `nxml` files from NCBI repository, which can be downloaded from their [FTP](https://ftp.ncbi.nlm.nih.gov/pubmed/baseline/).  
To download the files, you can use the following command  
`wget --cut-dirs 3 -r ftp://ftp.ncbi.nlm.nih.gov/pubmed/baseline/*.xml.gz`

---
### Usage
Refer to these [instructions](/README.md)
