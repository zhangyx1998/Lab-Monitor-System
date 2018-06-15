C_DIR="$( cd "$( dirname "$0" )" && pwd )"

target_server="zhangyx1998@inkfish.dhcp.lbl.gov"

target_folder="/home/zhangyx1998/Desktop/Chip_Database/"

password="zhangyx1998-key"

cd $C_DIR

auto_ssh () {
    echo "spawn ssh zhangyx1998@inkfish.dhcp.lbl.gov \"rm -r /home/zhangyx1998/Desktop/Chip_Database/*\";"
    expect -c "set timeout -1;
                spawn ssh zhangyx1998@inkfish.dhcp.lbl.gov \"rm -r /home/zhangyx1998/Desktop/Chip_Database/*\";
                expect {
                    *assword:* {send -- $1\r;
                                 expect {
                                    *denied* {exit 1;}
                                    eof
                                 }
                    }
                    eof         {exit 1;}
                }
                "
    return $?
}

auto_ssh $password

auto_scp () {
    echo "spawn scp -r -o StrictHostKeyChecking=no ${@:2};"
    expect -c "set timeout -1;
                spawn scp -r -o StrictHostKeyChecking=no ${@:2};
                expect {
                    *assword:* {send -- $1\r;
                                 expect {
                                    *denied* {exit 1;}
                                    eof
                                 }
                    }
                    eof         {exit 1;}
                }
                "
    return $?
}
auto_scp $password * zhangyx1998@inkfish.dhcp.lbl.gov:/home/zhangyx1998/Desktop/Chip_Database/
#echo $?