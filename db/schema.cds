namespace datamodel;

entity uploadLogFileReturn {
  key ID          : UUID;                    
  FILENAME        : String(255);  
  COMMENT         : String(200); 
  @Core.MediaType : 'application/octet-stream'  
  FILECONTENT     : LargeBinary;
  TYPE            : String(10);
}
