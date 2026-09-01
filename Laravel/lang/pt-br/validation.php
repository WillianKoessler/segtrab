<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    // 'accepted' => 'The :attribute field must be accepted.',
    'accepted' => 'O campo :attribute deve ser aceito.',

    // 'accepted_if' => 'The :attribute field must be accepted when :other is :value.',
    'accepted_if' => 'O campo :attribute deve ser aceito quando :other for :value.',

    // 'active_url' => 'The :attribute field must be a valid URL.',
    'active_url' => 'O campo :attribute deve ser uma URL válida.',

    // 'after' => 'The :attribute field must be a date after :date.',
    'after' => 'O campo :attribute deve ser uma data posterior a :date.',

    // 'after_or_equal' => 'The :attribute field must be a date after or equal to :date.',
    'after_or_equal' => 'O campo :attribute deve ser uma data posterior ou igual a :date.',

    // 'alpha' => 'The :attribute field must only contain letters.',
    'alpha' => 'O campo :attribute deve conter apenas letras.',

    // 'alpha_dash' => 'The :attribute field must only contain letters, numbers, dashes, and underscores.',
    'alpha_dash' => 'O campo :attribute deve conter apenas letras, números, hífens e sublinhados.',

    // 'alpha_num' => 'The :attribute field must only contain letters and numbers.',
    'alpha_num' => 'O campo :attribute deve conter apenas letras e números.',

    // 'any_of' => 'The :attribute field is invalid.',
    'any_of' => 'O campo :attribute é inválido.',

    // 'array' => 'The :attribute field must be an array.',
    'array' => 'O campo :attribute deve ser um array.',

    // 'ascii' => 'The :attribute field must only contain single-byte alphanumeric characters and symbols.',
    'ascii' => 'O campo :attribute deve conter apenas caracteres alfanuméricos e símbolos de byte único.',

    // 'before' => 'The :attribute field must be a date before :date.',
    'before' => 'O campo :attribute deve ser uma data anterior a :date.',

    // 'before_or_equal' => 'The :attribute field must be a date before or equal to :date.',
    'before_or_equal' => 'O campo :attribute deve ser uma data anterior ou igual a :date.',

    'between' => [
        // 'array' => 'The :attribute field must have between :min and :max items.',
        'array' => 'O campo :attribute deve ter entre :min e :max itens.',

        // 'file' => 'The :attribute field must be between :min and :max kilobytes.',
        'file' => 'O campo :attribute deve ter entre :min e :max kilobytes.',

        // 'numeric' => 'The :attribute field must be between :min and :max.',
        'numeric' => 'O campo :attribute deve estar entre :min e :max.',

        // 'string' => 'The :attribute field must be between :min and :max characters.',
        'string' => 'O campo :attribute deve ter entre :min e :max caracteres.',
    ],

    //'boolean' => 'The :attribute field must be true or false.',
    'boolean' => 'O campo :attribute deve ser verdadeiro ou falso.',

    //'can' => 'The :attribute field contains an unauthorized value.',
    'can' => 'O campo :attribute contém um valor não autorizado.',

    //'confirmed' => 'The :attribute field confirmation does not match.',
    'confirmed' => 'A confirmação de :attribute não corresponde.',

    //'contains' => 'The :attribute field is missing a required value.',
    'contains' => 'O campo :attribute está sem um valor obrigatório.',

    //'current_password' => 'The password is incorrect.',
    'current_password' => 'A senha está incorreta.',

    //'date' => 'The :attribute field must be a valid date.',
    'date' => 'O campo :attribute deve ser uma data válida.',

    //'date_equals' => 'The :attribute field must be a date equal to :date.',
    'date_equals' => 'O campo :attribute deve ser uma data igual a :date.',

    //'date_format' => 'The :attribute field must match the format :format.',
    'date_format' => 'O campo :attribute deve corresponder ao formato :format.',

    //'decimal' => 'The :attribute field must have :decimal decimal places.',
    'decimal' => 'O campo :attribute deve ter :decimal casas decimais.',

    //'declined' => 'The :attribute field must be declined.',
    'declined' => 'O campo :attribute deve ser recusado.',

    //'declined_if' => 'The :attribute field must be declined when :other is :value.',
    'declined_if' => 'O campo :attribute deve ser recusado quando :other for :value.',

    //'different' => 'The :attribute field and :other must be different.',
    'different' => 'O campo :attribute e :other devem ser diferentes.',

    //'digits' => 'The :attribute field must be :digits digits.',
    'digits' => 'O campo :attribute deve ter :digits dígitos.',

    //'digits_between' => 'The :attribute field must be between :min and :max digits.',
    'digits_between' => 'O campo :attribute deve ter entre :min e :max dígitos.',

    //'dimensions' => 'The :attribute field has invalid image dimensions.',
    'dimensions' => 'O campo :attribute possui dimensões de imagem inválidas.',

    //'distinct' => 'The :attribute field has a duplicate value.',
    'distinct' => 'O campo :attribute possui um valor duplicado.',

    //'doesnt_contain' => 'The :attribute field must not contain any of the following: :values.',
    'doesnt_contain' => 'O campo :attribute não deve conter nenhum dos seguintes valores: :values.',

    //'doesnt_end_with' => 'The :attribute field must not end with one of the following: :values.',
    'doesnt_end_with' => 'O campo :attribute não deve terminar com nenhum dos seguintes valores: :values.',

    //'doesnt_start_with' => 'The :attribute field must not start with one of the following: :values.',
    'doesnt_start_with' => 'O campo :attribute não deve começar com nenhum dos seguintes valores: :values.',

    //'email' => 'The :attribute field must be a valid email address.',
    'email' => 'O campo :attribute deve ser um endereço de e-mail válido.',

    //'encoding' => 'The :attribute field must be encoded in :encoding.',
    'encoding' => 'O campo :attribute deve estar codificado no formato :encoding.',

    //'ends_with' => 'The :attribute field must end with one of the following: :values.',
    'ends_with' => 'O campo :attribute deve terminar com um dos seguintes valores: :values.',

    //'enum' => 'The selected :attribute is invalid.',
    'enum' => 'O valor selecionado para :attribute é inválido.',

    //'exists' => 'The selected :attribute is invalid.',
    'exists' => 'O valor selecionado para :attribute é inválido.',

    //'extensions' => 'The :attribute field must have one of the following extensions: :values.',
    'extensions' => 'O campo :attribute deve ter uma das seguintes extensões: :values.',

    //'file' => 'The :attribute field must be a file.',
    'file' => 'O campo :attribute deve ser um arquivo.',

    //'filled' => 'The :attribute field must have a value.',
    'filled' => 'O campo :attribute deve ter um valor.',

    'gt' => [
        // 'array' => 'The :attribute field must have more than :value items.',
        'array' => 'O campo :attribute deve ter mais de :value itens.',

        // 'file' => 'The :attribute field must be greater than :value kilobytes.',
        'file' => 'O campo :attribute deve ter mais de :value kilobytes.',

        // 'numeric' => 'The :attribute field must be greater than :value.',
        'numeric' => 'O campo :attribute deve ser maior que :value.',

        // 'string' => 'The :attribute field must be greater than :value characters.',
        'string' => 'O campo :attribute deve ter mais de :value caracteres.',
    ],

    'gte' => [
        // 'array' => 'The :attribute field must have :value items or more.',
        'array' => 'O campo :attribute deve ter :value itens ou mais.',

        // 'file' => 'The :attribute field must be greater than or equal to :value kilobytes.',
        'file' => 'O campo :attribute deve ser maior ou igual a :value kilobytes.',

        // 'numeric' => 'The :attribute field must be greater than or equal to :value.',
        'numeric' => 'O campo :attribute deve ser maior ou igual a :value.',

        // 'string' => 'The :attribute field must be greater than or equal to :value characters.',
        'string' => 'O campo :attribute deve ter :value caracteres ou mais.',
    ],

    // 'hex_color' => 'The :attribute field must be a valid hexadecimal color.',
    'hex_color' => 'O campo :attribute deve ser uma cor hexadecimal válida.',

    // 'image' => 'The :attribute field must be an image.',
    'image' => 'O campo :attribute deve ser uma imagem.',

    // 'in' => 'The selected :attribute is invalid.',
    'in' => 'O valor selecionado para :attribute é inválido.',

    // 'in_array' => 'The :attribute field must exist in :other.',
    'in_array' => 'O campo :attribute deve existir em :other.',

    // 'in_array_keys' => 'The :attribute field must contain at least one of the following keys: :values.',
    'in_array_keys' => 'O campo :attribute deve conter pelo menos uma das seguintes chaves: :values.',

    // 'integer' => 'The :attribute field must be an integer.',
    'integer' => 'O campo :attribute deve ser um inteiro.',

    // 'ip' => 'The :attribute field must be a valid IP address.',
    'ip' => 'O campo :attribute deve ser um endereço IP válido.',

    // 'ipv4' => 'The :attribute field must be a valid IPv4 address.',
    'ipv4' => 'O campo :attribute deve ser um endereço IPv4 válido.',

    // 'ipv6' => 'The :attribute field must be a valid IPv6 address.',
    'ipv6' => 'O campo :attribute deve ser um endereço IPv6 válido.',

    // 'json' => 'The :attribute field must be a valid JSON string.',
    'json' => 'O campo :attribute deve ser uma string JSON válida.',

    // 'list' => 'The :attribute field must be a list.',
    'list' => 'O campo :attribute deve ser uma lista.',

    // 'lowercase' => 'The :attribute field must be lowercase.',
    'lowercase' => 'O campo :attribute deve estar em minúsculas.',

    'lt' => [
        // 'array' => 'The :attribute field must have less than :value items.',
        'array' => 'O campo :attribute deve ter menos de :value itens.',

        // 'file' => 'The :attribute field must be less than :value kilobytes.',
        'file' => 'O campo :attribute deve ter menos de :value kilobytes.',

        // 'numeric' => 'The :attribute field must be less than :value.',
        'numeric' => 'O campo :attribute deve ser menor que :value.',

        // 'string' => 'The :attribute field must be less than :value characters.',
        'string' => 'O campo :attribute deve ter menos de :value caracteres.',
    ],

    'lte' => [
        //'array' => 'The :attribute field must not have more than :value items.',
        'array' => 'O campo :attribute não deve ter mais de :value itens.',

        //'file' => 'The :attribute field must be less than or equal to :value kilobytes.',
        'file' => 'O campo :attribute deve ser menor ou igual a :value kilobytes.',

        //'numeric' => 'The :attribute field must be less than or equal to :value.',
        'numeric' => 'O campo :attribute deve ser menor ou igual a :value.',

        //'string' => 'The :attribute field must be less than or equal to :value characters.',
        'string' => 'O campo :attribute deve ter no máximo :value caracteres.',
    ],

    // 'mac_address' => 'The :attribute field must be a valid MAC address.',
    'mac_address' => 'O campo :attribute deve ser um endereço MAC válido.',

    'max' => [
        // 'array' => 'The :attribute field must not have more than :max items.',
        'array' => 'O campo :attribute não deve ter mais de :max itens.',

        // 'file' => 'The :attribute field must not be greater than :max kilobytes.',
        'file' => 'O campo :attribute não deve ser maior que :max kilobytes.',

        // 'numeric' => 'The :attribute field must not be greater than :max.',
        'numeric' => 'O campo :attribute não deve ser maior que :max.',

        // 'string' => 'The :attribute field must not be greater than :max characters.',
        'string' => 'O campo :attribute não deve ser maior que :max caracteres.',
    ],

    // 'max_digits' => 'The :attribute field must not have more than :max digits.',
    'max_digits' => 'O campo :attribute não deve ter mais de :max dígitos.',

    // 'mimes' => 'The :attribute field must be a file of type: :values.',
    'mimes' => 'O campo :attribute deve ser um arquivo do tipo: :values.',

    // 'mimetypes' => 'The :attribute field must be a file of type: :values.',
    'mimetypes' => 'O campo :attribute deve ser um arquivo do tipo: :values.',

    'min' => [
        // 'array' => 'The :attribute field must have at least :min items.',
        'array' => 'O campo :attribute deve ter pelo menos :min itens.',

        // 'file' => 'The :attribute field must be at least :min kilobytes.',
        'file' => 'O campo :attribute deve ter pelo menos :min kilobytes.',

        // 'numeric' => 'The :attribute field must be at least :min.',
        'numeric' => 'O campo :attribute deve ser pelo menos :min.',

        // 'string' => 'The :attribute field must be at least :min characters.',
        'string' => 'O campo :attribute deve ter pelo menos :min caracteres.',
    ],

    // 'min_digits' => 'The :attribute field must have at least :min digits.',
    'min_digits' => 'O campo :attribute deve ter pelo menos :min dígitos.',

    // 'missing' => 'The :attribute field must be missing.',
    'missing' => 'O campo :attribute deve estar ausente.',

    // 'missing_if' => 'The :attribute field must be missing when :other is :value.',
    'missing_if' => 'O campo :attribute deve estar ausente quando :other for :value.',

    // 'missing_unless' => 'The :attribute field must be missing unless :other is :value.',
    'missing_unless' => 'O campo :attribute deve estar ausente, a menos que :other seja :value.',

    // 'missing_with' => 'The :attribute field must be missing when :values is present.',
    'missing_with' => 'O campo :attribute deve estar ausente quando :values estiver presente.',

    // 'missing_with_all' => 'The :attribute field must be missing when :values are present.',
    'missing_with_all' => 'O campo :attribute deve estar ausente quando :values estiverem presentes.',

    // 'multiple_of' => 'The :attribute field must be a multiple of :value.',
    'multiple_of' => 'O campo :attribute deve ser múltiplo de :value.',

    // 'not_in' => 'The selected :attribute is invalid.',
    'not_in' => 'O valor selecionado para :attribute é inválido.',

    // 'not_regex' => 'The :attribute field format is invalid.',
    'not_regex' => 'O formato de :attribute é inválido.',

    // 'numeric' => 'The :attribute field must be a number.',
    'numeric' => 'O campo :attribute deve ser um número.',

    'password' => [
        // 'letters' => 'The :attribute field must contain at least one letter.',
        'letters' => 'O campo :attribute deve conter pelo menos uma letra.',

        // 'mixed' => 'The :attribute field must contain at least one uppercase and one lowercase letter.',
        'mixed' => 'O campo :attribute deve conter pelo menos uma letra maiúscula e uma minúscula.',

        // 'numbers' => 'The :attribute field must contain at least one number.',
        'numbers' => 'O campo :attribute deve conter pelo menos um número.',

        // 'symbols' => 'The :attribute field must contain at least one symbol.',
        'symbols' => 'O campo :attribute deve conter pelo menos um símbolo.',

        // 'uncompromised' => 'The given :attribute has appeared in a data leak. Please choose a different :attribute.',
        'uncompromised' => 'O valor informado para :attribute apareceu em uma violação de dados. Escolha outro :attribute.',
    ],

    // 'present' => 'The :attribute field must be present.',
    'present' => 'O campo :attribute deve estar presente.',
    
    // 'present_if' => 'The :attribute field must be present when :other is :value.',
    'present_if' => 'O campo :attribute deve estar presente quando :other for :value.',
    
    // 'present_unless' => 'The :attribute field must be present unless :other is :value.',
    'present_unless' => 'O campo :attribute deve estar presente, a menos que :other seja :value.',
    
    // 'present_with' => 'The :attribute field must be present when :values is present.',
    'present_with' => 'O campo :attribute deve estar presente quando :values estiver presente.',
    
    // 'present_with_all' => 'The :attribute field must be present when :values are present.',
    'present_with_all' => 'O campo :attribute deve estar presente quando :values estiverem presentes.',
    
    // 'prohibited' => 'The :attribute field is prohibited.',
    'prohibited' => 'O campo :attribute é proibido.',
    
    // 'prohibited_if' => 'The :attribute field is prohibited when :other is :value.',
    'prohibited_if' => 'O campo :attribute é proibido quando :other for :value.',
    
    // 'prohibited_if_accepted' => 'The :attribute field is prohibited when :other is accepted.',
    'prohibited_if_accepted' => 'O campo :attribute é proibido quando :other for aceito.',
    
    // 'prohibited_if_declined' => 'The :attribute field is prohibited when :other is declined.',
    'prohibited_if_declined' => 'O campo :attribute é proibido quando :other for recusado.',
    
    // 'prohibited_unless' => 'The :attribute field is prohibited unless :other is in :values.',
    'prohibited_unless' => 'O campo :attribute é proibido, a menos que :other esteja em :values.',
    
    // 'prohibits' => 'The :attribute field prohibits :other from being present.',
    'prohibits' => 'O campo :attribute proíbe :other de estar presente.',
    
    // 'regex' => 'The :attribute field format is invalid.',
    'regex' => 'O formato de :attribute é inválido.',
    
    // 'required' => 'The :attribute field is required.',
    'required' => 'O campo :attribute é obrigatório.',
    
    // 'required_array_keys' => 'The :attribute field must contain entries for: :values.',
    'required_array_keys' => 'O campo :attribute deve conter entradas para: :values.',
    
    // 'required_if' => 'The :attribute field is required when :other is :value.',
    'required_if' => 'O campo :attribute é obrigatório quando :other for :value.',
    
    // 'required_if_accepted' => 'The :attribute field is required when :other is accepted.',
    'required_if_accepted' => 'O campo :attribute é obrigatório quando :other for aceito.',
    
    // 'required_if_declined' => 'The :attribute field is required when :other is declined.',
    'required_if_declined' => 'O campo :attribute é obrigatório quando :other for recusado.',
    
    // 'required_unless' => 'The :attribute field is required unless :other is in :values.',
    'required_unless' => 'O campo :attribute é obrigatório, a menos que :other esteja em :values.',
    
    // 'required_with' => 'The :attribute field is required when :values is present.',
    'required_with' => 'O campo :attribute é obrigatório quando :values estiver presente.',
    
    // 'required_with_all' => 'The :attribute field is required when :values are present.',
    'required_with_all' => 'O campo :attribute é obrigatório quando :values estiverem presentes.',
    
    // 'required_without' => 'The :attribute field is required when :values is not present.',
    'required_without' => 'O campo :attribute é obrigatório quando :values não estiver presente.',
    
    // 'required_without_all' => 'The :attribute field is required when none of :values are present.',
    'required_without_all' => 'O campo :attribute é obrigatório quando nenhum de :values estiver presente.',
    
    // 'same' => 'The :attribute field must match :other.',
    'same' => 'O campo :attribute deve corresponder a :other.',

    'size' => [
        // 'array' => 'The :attribute field must contain :size items.',
        'array' => 'O campo :attribute deve conter :size itens.',
        
        // 'file' => 'The :attribute field must be :size kilobytes.',
        'file' => 'O campo :attribute deve ter :size kilobytes.',
        
        // 'numeric' => 'The :attribute field must be :size.',
        'numeric' => 'O campo :attribute deve ter :size.',
        
        // 'string' => 'The :attribute field must be :size characters.',
        'string' => 'O campo :attribute deve ter :size caracteres.',
    ],

    // 'starts_with' => 'The :attribute field must start with one of the following: :values.',
    'starts_with' => 'O campo :attribute deve começar com um dos seguintes valores: :values.',
    
    // 'string' => 'The :attribute field must be a string.',
    'string' => 'O campo :attribute deve ser uma string.',
    
    // 'timezone' => 'The :attribute field must be a valid timezone.',
    'timezone' => 'O campo :attribute deve ser um fuso horário válido.',
    
    // 'unique' => 'The :attribute has already been taken.',
    'unique' => 'O valor informado para :attribute já foi utilizado.',
    
    // 'uploaded' => 'The :attribute failed to upload.',
    'uploaded' => 'Falha ao enviar :attribute.',
    
    // 'uppercase' => 'The :attribute field must be uppercase.',
    'uppercase' => 'O campo :attribute deve estar em maiúsculas.',
    
    // 'url' => 'The :attribute field must be a valid URL.',
    'url' => 'O campo :attribute deve ser uma URL válida.',
    
    // 'ulid' => 'The :attribute field must be a valid ULID.',
    'ulid' => 'O campo :attribute deve ser um ULID válido.',
    
    // 'uuid' => 'The :attribute field must be a valid UUID.',
    'uuid' => 'O campo :attribute deve ser um UUID válido.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'name' => 'nome',
        'password' => 'senha',
        'password_confirmation' => 'confirmação de senha',
        'role' => 'função',
        'is_active' => 'status ativo',
    ],

];
