using { datamodel as my } from '../db/schema.cds';

service ReturnProduct @(path : '/sap/odata/opu/ReturnProductCds'){
    entity uploadLogFileReturn as projection on my.uploadLogFileReturn;
}
    



 
