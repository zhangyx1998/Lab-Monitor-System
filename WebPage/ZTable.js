var col_display=[0,0,0,0,0];

function switch_col_display(col)
{
	var status=col_display[col];
	for(var i=0;i<5;i++)
	{
		col_display[i]=0;
	}
	col_display[col]=1-status;

	for(var i=0;i<5;i++)
	{
		if(col_display[i]==1)
		{
			document.getElementById("Table_Title_"+i.toString()).className="table_header active";
			document.getElementById("col_filter_"+i.toString()).style.display="";
		}
		else
		{
			document.getElementById("Table_Title_"+i.toString()).className="table_header unactive";
			document.getElementById("col_filter_"+i.toString()).style.display="none";
		}
	}
}

var filter_list={

	id_min: undefined,
	id_max: undefined,
	id_applied: false,

	source_list: ['CONTROL','VERSION','Arduino_Board','Arduino_IO','WPG'],

	type_casesen: true,
	type_keyword: '',
	type_applied: false,

	content_casesen: true,
	content_keyword: '',
	content_applied: false,

	date_min: undefined,//STRING
	date_max: undefined,//STRING
	date_applied: false,

}

Array.prototype.indexOf = function(val)
{
	for (var i = 0; i < this.length; i++)
	{
		if (this[i] == val) return i;
	}
	return -1;
};

Array.prototype.remove = function(val)
{
	var index = this.indexOf(val);
	while (index > -1) 
		{
			this.splice(index, 1);
			index = this.indexOf(val);
		}
};

function filter_source_change(source_name)
{
	button=document.getElementById("SourceSwitch_"+source_name);
	if(button.className=="tf_button activated")//Switch to unactive, remove name from list
	{
		filter_list.source_list.remove(source_name);
		button.className="tf_button unactivated";
	}
	else
	{
		filter_list.source_list.remove(source_name);//In case the name has existed in the list
		filter_list.source_list.push(source_name);
		button.className="tf_button activated";
	}
	filter_refresh();
}

function filter_apply_switch(col_ID)
{
	button=document.getElementById("APPLY_"+col_ID);
	if(button.className=="tf_button activated")//Switch to unactive, remove name from list
	{
		filter_list[col_ID+'_applied']= false;
		button.className="tf_button unactivated";
	}
	else
	{
		filter_list[col_ID+'_applied']= true;
		button.className="tf_button activated";
	}
	filter_refresh();
}

function filter_casesen_switch(col_ID)
{
	button=document.getElementById("CaseSen_"+col_ID);
	if(button.className=="tf_button activated")//Switch to unactive, remove name from list
	{
		filter_list[col_ID+'_casesen']= false;
		button.className="tf_button unactivated";
	}
	else
	{
		filter_list[col_ID+'_casesen']= true;
		button.className="tf_button activated";
	}
	filter_refresh();
}

function filter_text_change(col_ID,type)
{
	input=document.getElementById("Input_"+col_ID);
	content_string=input.value;
	if(type=='integer')
	{
		content_string.replace(/[^0-9]/g,'');
		if(content_string!='')
		{
			var val=parseInt(content_string);
			filter_list[col_ID]=val;
		}
		else
		{
			filter_list[col_ID]=undefined;
		}
	}
	else if(type=='float')
	{
		if(content_string!='')
		{
			filter_list[col_ID]=content_string;//not defined yet
		}
		else
		{
			filter_list[col_ID]=undefined;
		}
	}
	else if(type=='date')
	{
		if(content_string!='')
		{
			content_string=content_string.replace(/-/g,'/')
			filter_list[col_ID]=new Date(content_string);
			//alert(content_string);
			//alert(filter_list[col_ID]);
			/*
			content_string=content_string.split(' ');
			if(content_string[0]!=undefined)
			{
				var ymd=content_string[0].split('-');
				for(digits in ymd)
				{
					while(ymd[digits].length<2)
					{
						ymd[digits]='0'+ymd[digits]
					}
				}
				var list=ymd.join('');
				ymd=parseInt(list);
			}
			else
			{
				var ymd= undefined;
			}
			if(content_string[1]!=undefined)
			{
				var hms=content_string[1].split(':');
				for(digits in hms)
				{
					while(hms[digits].length<2)
					{
						hms[digits]='0'+hms[digits]
					}
				}
				var list=hms.join('');
				hms=parseInt(list);
			}
			else
			{
				var hms=undefined;
			}
			filter_list[col_ID]=[ymd,hms];
			alert(filter_list[col_ID]);
			*/
		}
		else
		{
			filter_list[col_ID]=undefined;
		}
	}
	else if(type=='string')
	{
		if(content_string!='')
		{
			filter_list[col_ID]=content_string.split(' ');
		}
		else
		{
			filter_list[col_ID]=undefined;
		}
	}
	else
	{
		if(content_string!='')
		{
			filter_list[col_ID]=content_string;
		}
		else
		{
			filter_list[col_ID]=undefined;
		}
	}
	filter_refresh();
}

function filter_reset()
{
	st='';
	for(items in filter_list) st+=(items+':'+filter_list[items]+'\n');
	console.log(st);
	filter_refresh();
}

function filter_refresh()
{
	var row_count=0;
	//console.log('filter_refresh');
	//console.log('data-row-'+row_count.toString());
	while(document.getElementById('data-row-'+row_count.toString())!=undefined)
	{
		table_inner_data=document.getElementById('data-row-'+row_count.toString()).innerHTML.split('<!--DATA-->');
		var i=0;
		var display=true;
		for (rows in table_inner_data)
			{
				if(table_inner_data[i]!=undefined && table_inner_data[i]!='') table_inner_data[i]=table_inner_data[i].split('<')[0];
				//console.log(table_inner_data[i]);
				if(filter_list.id_applied && i==1)
				{
					//i=1 ID
					//i=2 SOURCE
					//i=3 TYPE
					//i=4 CONTENT
					//i=5 DATE
					//console.log(table_inner_data[i]);
					cur_id=parseInt(table_inner_data[i]);
					if((
						(filter_list.id_min==undefined)||(cur_id>=filter_list.id_min)
						)&&(
						(filter_list.id_max==undefined)||(cur_id<=filter_list.id_max)
						))
						{
							//alert('muted row '+row_count.toString());
							display=true;
						}
						else
						{
							display=false;
						}
				}
				if(i==2)
				{
					match_flag=false;
					//console.log(table_inner_data[i]);
					for(Keys in filter_list.source_list)
					{
						//console.log('KEY: '+filter_list.source_list[Keys]);
						if(table_inner_data[i].indexOf(filter_list.source_list[Keys])>=0) match_flag=true;
					}
					display=display && match_flag;
				}
				if(filter_list.type_applied && i==3 && filter_list.type_keyword!=undefined)
				{
					var match_flag=false;
					for(var Keys=0;Keys<filter_list.type_keyword.length;Keys++)
					{
						if(table_inner_data[i].indexOf(filter_list.type_keyword[Keys])>=0) match_flag=true;
					}
					display= display && match_flag;
				}
				if(filter_list.content_applied && i==4 && filter_list.content_keyword!=undefined)
				{
					var match_flag=false;
					for(var Keys=0;Keys<filter_list.content_keyword.length;Keys++)
					{
						if(table_inner_data[i].indexOf(filter_list.content_keyword[Keys])>=0) match_flag=true;
					}
					display= display && match_flag;
				}
				if(filter_list.date_applied && i==5)
				{
					var match_flag=false;
					var cur_date=new Date(table_inner_data[i].replace(/-/g,'/'));
					//alert(cur_date);
					//alert(table_inner_data[i]);
					if(
						(
							(filter_list.date_min==undefined)
							||
							(filter_list.date_min<=cur_date)
						)
						&&
						(
							(filter_list.date_max==undefined)
							||
						 	(filter_list.date_max>=cur_date)
						)
					   )
					{
						match_flag=true;
					}
					display=display && match_flag;
				}
				i++;
			}
		if(display)
		{
			document.getElementById('data-row-'+row_count.toString()).style.display='';
			document.getElementById('data-row-blk-'+row_count.toString()).style.display='';
		}
		else
		{
			//alert('muted row '+toString(row_count));
			document.getElementById('data-row-'+row_count.toString()).style.display='none';
			document.getElementById('data-row-blk-'+row_count.toString()).style.display='none';
		}
		//alert(row_count);
		row_count++;
	}
}